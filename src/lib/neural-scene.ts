type Point3D = { x: number; y: number; z: number; tone: number };

/** Dependency-free particle renderer; geometry is prepared once, not per frame. */
export function mountNeuralScene(element: HTMLElement) {
  const canvas = element.querySelector<HTMLCanvasElement>('canvas');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;
  const ctx = context;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = element.closest<HTMLElement>('.hero');
  const styles = getComputedStyle(element);
  const palette = ['vision', 'language', 'audio', 'sensor'].map(name =>
    styles.getPropertyValue(`--signal-${name}-rgb`).trim()
  );
  const points: Point3D[] = [];
  const edges: [number, number][] = [];
  const rows = 21;
  const columns = 36;
  for (let row = 1; row < rows; row++) {
    const latitude = Math.PI * row / rows;
    for (let column = 0; column < columns; column++) {
      const longitude = Math.PI * 2 * (column + (row % 2) * .5) / columns;
      points.push({
        x: Math.sin(latitude) * Math.cos(longitude),
        y: Math.cos(latitude),
        z: Math.sin(latitude) * Math.sin(longitude),
        tone: Math.floor(column / (columns / 4))
      });
      const index = (row - 1) * columns + column;
      edges.push([index, (row - 1) * columns + (column + 1) % columns]);
      if (row < rows - 1) {
        edges.push([index, index + columns]);
        if ((column + row) % 3 === 0) edges.push([index, row * columns + (column + 1) % columns]);
      }
    }
  }
  let scale = 1;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let inView = true;
  let disposed = false;

  const draw = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, 640, 640);
    const angle = elapsed * .000065;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tilt = -.23;
    const radius = 131;
    const projected = points.map(point => {
      const x = point.x * cos + point.z * sin;
      const z = point.z * cos - point.x * sin;
      const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
      const depth = z * Math.cos(tilt) + point.y * Math.sin(tilt);
      return { x: 320 + x * radius, y: 320 + y * radius, z: depth, tone: point.tone };
    });
    // A dark glass interior gives the light filaments depth on a light page.
    const atmosphere = ctx.createRadialGradient(320, 320, 112, 320, 320, 151);
    atmosphere.addColorStop(0, 'rgba(107,184,221,0)');
    atmosphere.addColorStop(.55, 'rgba(105,173,213,.17)');
    atmosphere.addColorStop(1, 'rgba(107,184,221,0)');
    ctx.fillStyle = atmosphere;
    ctx.fillRect(165, 165, 310, 310);
    const body = ctx.createRadialGradient(276, 267, 9, 328, 332, 143);
    body.addColorStop(0, '#305975');
    body.addColorStop(.42, '#142f50');
    body.addColorStop(.84, '#091b38');
    body.addColorStop(1, '#284f74');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(320, 320, radius, 0, Math.PI * 2);
    ctx.fill();
    // Back and front edges have different opacity, preserving the spherical volume.
    for (const [a, b] of edges) {
      const first = projected[a];
      const second = projected[b];
      const depth = (first.z + second.z) / 2;
      const shimmer = .72 + .28 * Math.sin(a * .18 + elapsed * .0005);
      const alpha = depth < 0 ? .065 : (.19 + depth * .37) * shimmer;
      ctx.strokeStyle = `rgba(${palette[first.tone]},${alpha})`;
      ctx.lineWidth = depth < 0 ? .45 : .65;
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
      ctx.stroke();
    }
    for (let i = 0; i < projected.length; i++) {
      const point = projected[i];
      if (point.z < -.3) continue;
      const pulse = Math.pow(Math.max(0, Math.sin(i * .71 + elapsed * .0008)), 12);
      const opacity = .3 + Math.max(0, point.z) * .55;
      if (pulse > .55 && point.z > 0) {
        ctx.fillStyle = `rgba(${palette[point.tone]},${pulse * .14})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${palette[point.tone]},${opacity})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, .6 + Math.max(0, point.z) * .55 + pulse * .4, 0, Math.PI * 2);
      ctx.fill();
    }
    // Fine orbital filaments pass behind and in front of the neural surface.
    for (let ring = 0; ring < 3; ring++) {
      const rotation = -.5 + ring * .87;
      const ringRadius = 149 + ring * 7;
      const ringPoint = (a: number) => {
        const x = Math.cos(a) * ringRadius;
        const y = Math.sin(a) * ringRadius * .35;
        return { x: 320 + x * Math.cos(rotation) - y * Math.sin(rotation), y: 320 + x * Math.sin(rotation) + y * Math.cos(rotation) };
      };
      for (let i = 0; i < 160; i++) {
        const phase = i / 160 * Math.PI * 2;
        const start = ringPoint(phase);
        const end = ringPoint((i + 1) / 160 * Math.PI * 2);
        if (Math.sin(phase) < 0 && Math.hypot(start.x - 320, start.y - 320) < radius) continue;
        const highlight = Math.pow((1 + Math.cos(phase - angle * 2 - ring * 2)) / 2, 18);
        ctx.strokeStyle = `rgba(${palette[ring]},${.12 + highlight * .65})`;
        ctx.lineWidth = .6 + highlight * .7;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(183,231,252,.6)';
    ctx.lineWidth = .7;
    ctx.beginPath();
    ctx.arc(320, 320, radius, Math.PI * 1.06, Math.PI * 1.68);
    ctx.stroke();
    element.dataset.ready = '';
  };
  const tick = (now: number) => {
    if (now - previous >= 1000 / 30) {
      elapsed += previous ? Math.min(now - previous, 80) : 0;
      previous = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  };
  const syncPlayback = () => {
    cancelAnimationFrame(frame);
    previous = 0;
    const paused = motion.matches || !inView || document.hidden;
    element.toggleAttribute('data-paused', paused);
    hero?.toggleAttribute('data-animation-paused', paused);
    if (!disposed && !paused) frame = requestAnimationFrame(tick);
    else if (!disposed) draw();
  };
  const resize = () => {
    const width = element.getBoundingClientRect().width;
    const pixels = Math.round(width * Math.min(window.devicePixelRatio || 1, 2));
    canvas.width = pixels;
    canvas.height = pixels;
    scale = pixels / 640;
    draw();
  };
  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPlayback();
  }, { rootMargin: '80px' });
  resizeObserver.observe(element);
  intersectionObserver.observe(hero ?? element);
  motion.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
  const cleanup = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    motion.removeEventListener('change', syncPlayback);
    document.removeEventListener('visibilitychange', syncPlayback);
  };
  document.addEventListener('astro:before-swap', cleanup, { once: true });
  resize();
  syncPlayback();
}

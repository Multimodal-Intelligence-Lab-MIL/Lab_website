const svgNamespace = 'http://www.w3.org/2000/svg';
let filterNumber = 0;

/** One cached edge map per navigation/control, built after paint, never per frame.
 * WebKit/Firefox retain the CSS glass material: SVG backdrop filters vary there. */
export function enhanceLiquidGlass(element: HTMLElement) {
  if (!/Chrome|Chromium|Edg\//.test(navigator.userAgent)) return;
  const transparency = matchMedia('(prefers-reduced-transparency: reduce)');
  const contrast = matchMedia('(forced-colors: active)');
  const id = `mil-refraction-${++filterNumber}`;
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;pointer-events:none';
  const filter = document.createElementNS(svgNamespace, 'filter');
  filter.id = id;
  filter.setAttribute('filterUnits', 'userSpaceOnUse');
  filter.setAttribute('x', '0');
  filter.setAttribute('y', '0');
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const map = document.createElementNS(svgNamespace, 'feImage');
  map.setAttribute('result', 'edgeMap');
  map.setAttribute('preserveAspectRatio', 'none');
  const displacement = document.createElementNS(svgNamespace, 'feDisplacementMap');
  displacement.setAttribute('in', 'SourceGraphic');
  displacement.setAttribute('in2', 'edgeMap');
  displacement.setAttribute('scale', '16');
  displacement.setAttribute('xChannelSelector', 'R');
  displacement.setAttribute('yChannelSelector', 'G');
  filter.append(map, displacement);
  svg.append(filter);
  document.body.append(svg);
  let dimensions = '';
  let queued = false;

  function update() {
    queued = false;
    if (transparency.matches || contrast.matches) {
      element.style.removeProperty('--glass-refraction');
      return;
    }
    const { width, height } = element.getBoundingClientRect();
    if (!width || !height) return;
    const key = `${Math.round(width)}:${Math.round(height)}`;
    if (key === dimensions) {
      element.style.setProperty('--glass-refraction', `url("#${id}")`);
      return;
    }
    dimensions = key;
    const ratio = Math.min(1, 512 / width, 128 / height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    const context = canvas.getContext('2d');
    if (!context) return;
    const pixels = context.createImageData(canvas.width, canvas.height);
    const radius = Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 28, height / 2);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const band = Math.min(12, halfHeight / 2);
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const px = (x + .5) / ratio - halfWidth;
        const py = (y + .5) / ratio - halfHeight;
        const qx = Math.abs(px) - halfWidth + radius;
        const qy = Math.abs(py) - halfHeight + radius;
        const nx = Math.max(qx, 0);
        const ny = Math.max(qy, 0);
        const distance = Math.min(Math.max(qx, qy), 0) + Math.hypot(nx, ny) - radius;
        const strength = Math.max(0, Math.min(1, 1 + distance / band));
        const bend = Math.sin(strength * Math.PI / 2);
        const length = Math.hypot(nx, ny) || 1;
        const normalX = nx || ny ? nx / length : Number(qx > qy);
        const normalY = nx || ny ? ny / length : Number(qy >= qx);
        const index = (y * canvas.width + x) * 4;
        pixels.data[index] = Math.round(128 - Math.sign(px) * normalX * bend * 108);
        pixels.data[index + 1] = Math.round(128 - Math.sign(py) * normalY * bend * 108);
        pixels.data[index + 2] = 128;
        pixels.data[index + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    map.setAttribute('href', canvas.toDataURL());
    for (const node of [filter, map]) {
      node.setAttribute('width', String(width));
      node.setAttribute('height', String(height));
    }
    element.style.setProperty('--glass-refraction', `url("#${id}")`);
  }
  function schedule() {
    if (queued) return;
    queued = true;
    // Two frames let the unenhanced glass and page content paint first.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(update, { timeout: 1500 });
      else setTimeout(update, 100);
    }));
  }
  new ResizeObserver(schedule).observe(element);
  transparency.addEventListener('change', schedule);
  contrast.addEventListener('change', schedule);
  schedule();
}

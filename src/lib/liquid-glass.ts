/* Liquid glass refraction and pointer light.

   Refraction follows Liquid-Glass-HTML: a rounded-rectangle signed distance field
   gives each pane a narrow rim in which the backdrop is sampled from further inside,
   so the scene bends at the edge while the centre stays clear. The map is drawn once
   per size into a canvas and applied through an SVG feDisplacementMap referenced
   from backdrop-filter. Only Chromium renders SVG backdrop filters; Safari and
   Firefox keep the CSS material (lighting, tint, saturation) without bending.

   Tiers (data-glass) only tune the rim: "bar" and "control" bend harder, "panel" and
   "sheet" (large reading cards, refracting on hover only) bend more gently. One
   displacement per pane: like Liquid-Glass-HTML, no chained colour split, which
   tripled the cost of the navigation bar while scrolling. */

type Tier = 'bar' | 'control' | 'panel' | 'sheet' | 'float';

const svgNamespace = 'http://www.w3.org/2000/svg';
const filters = new Map<string, Promise<string>>();
const mapLimit = 384;
let defs: SVGDefsElement | undefined;
let counter = 0;

// BaseLayout marks engines without SVG backdrop filters before first paint.
const supportsRefraction = () =>
  document.documentElement.dataset.glassEngine !== 'css' &&
  !matchMedia('(prefers-reduced-transparency: reduce), (forced-colors: active)').matches;

function container() {
  if (defs) return defs;
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  defs = document.createElementNS(svgNamespace, 'defs');
  svg.append(defs);
  document.body.append(svg);
  return defs;
}

const smoothStep = (edge0: number, edge1: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Displacement map: zero inside, rising to `shift` px at the rim, pointing inward. */
function drawMap(width: number, height: number, radius: number, band: number, shift: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, Math.round(Math.min(width, mapLimit)));
  canvas.height = Math.max(2, Math.round(Math.min(height, mapLimit)));
  const sx = width / canvas.width;
  const sy = height / canvas.height;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(canvas.width, canvas.height);
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = (x + .5) * sx - halfWidth;
      const py = (y + .5) * sy - halfHeight;
      const qx = Math.abs(px) - halfWidth + radius;
      const qy = Math.abs(py) - halfHeight + radius;
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const distance = Math.min(Math.max(qx, qy), 0) + Math.hypot(ox, oy) - radius;
      const strength = smoothStep(-band, 0, distance);
      // Outward surface normal of the rounded rectangle at this point.
      let nx = 0;
      let ny = 0;
      if (ox > 0 || oy > 0) {
        const length = Math.hypot(ox, oy);
        nx = ox / length;
        ny = oy / length;
      } else if (qx > qy) nx = 1;
      else ny = 1;
      // Sample inward: subtract the outward normal.
      const dx = -Math.sign(px) * nx * strength;
      const dy = -Math.sign(py) * ny * strength;
      const index = (y * canvas.width + x) * 4;
      image.data[index] = Math.round(128 + dx * 127);
      image.data[index + 1] = Math.round(128 + dy * 127);
      image.data[index + 2] = 128;
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return { href: canvas.toDataURL(), scale: shift * 2 };
}

function displacement(input: string, map: string, scale: number, result: string) {
  const node = document.createElementNS(svgNamespace, 'feDisplacementMap');
  node.setAttribute('in', input);
  node.setAttribute('in2', map);
  node.setAttribute('scale', scale.toFixed(2));
  node.setAttribute('xChannelSelector', 'R');
  node.setAttribute('yChannelSelector', 'G');
  node.setAttribute('result', result);
  return node;
}

/** Resolves with the filter id once its map image is decoded (see refract()). */
async function filterFor(tier: Tier, width: number, height: number, radius: number) {
  const short = Math.min(width, height);
  const gentle = tier === 'panel' || tier === 'sheet';
  const band = Math.min(gentle ? 26 : 20, short * .32);
  const shift = Math.min(gentle ? 22 : 30, short * (gentle ? .16 : .36));
  const key = `${gentle}:${width}x${height}:${radius}`;
  const cached = filters.get(key);
  if (cached) return cached;
  const ready = buildFilter(width, height, radius, band, shift);
  filters.set(key, ready);
  return ready;
}

async function buildFilter(width: number, height: number, radius: number, band: number, shift: number) {
  const short = Math.min(width, height);

  const id = `mil-glass-${++counter}`;
  const filter = document.createElementNS(svgNamespace, 'filter');
  filter.id = id;
  filter.setAttribute('filterUnits', 'userSpaceOnUse');
  filter.setAttribute('x', '0');
  filter.setAttribute('y', '0');
  filter.setAttribute('width', String(width));
  filter.setAttribute('height', String(height));
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const { href, scale } = drawMap(width, height, Math.min(radius, short / 2), band, shift);
  // Decode the map before any pane references it, so the filter is not first built
  // around an image that is still loading.
  const decoded = new Image();
  decoded.src = href;
  await decoded.decode().catch(() => {});
  const image = document.createElementNS(svgNamespace, 'feImage');
  image.setAttribute('href', href);
  image.setAttribute('x', '0');
  image.setAttribute('y', '0');
  image.setAttribute('width', String(width));
  image.setAttribute('height', String(height));
  image.setAttribute('preserveAspectRatio', 'none');
  image.setAttribute('result', 'map');
  filter.append(image);

  filter.append(displacement('SourceGraphic', 'map', scale, 'bent'));
  container().append(filter);
  return id;
}

function refract(element: HTMLElement) {
  const tier = (element.dataset.glass || 'panel') as Tier;
  let size = '';
  let queued = false;
  const update = () => {
    queued = false;
    const width = Math.round(element.offsetWidth);
    const height = Math.round(element.offsetHeight);
    if (width < 24 || height < 24) return;
    const radius = Math.round(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0);
    const key = `${width}x${height}:${radius}`;
    if (key === size) return;
    size = key;
    void filterFor(tier, width, height, radius).then((id) => {
      if (size !== key) return;
      element.style.setProperty('--lg-refraction', `url("#${id}")`);
      // Re-apply once after the first paint (the unquoted form is equivalent but counts
      // as a new value), in case the map image reached the filter late.
      setTimeout(() => {
        if (size === key) element.style.setProperty('--lg-refraction', `url(#${id})`);
      }, 250);
    });
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    if ('requestIdleCallback' in window) window.requestIdleCallback(update, { timeout: 800 });
    else setTimeout(update, 60);
  };
  new ResizeObserver(schedule).observe(element);
}

/** Pointer-following highlight, after Apple-UI: one passive listener for every pane. */
function followPointer() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let current: HTMLElement | null = null;
  let pending: PointerEvent | null = null;
  // Coordinates are written at most once a frame; each write restyles the pane.
  const apply = () => {
    const event = pending;
    pending = null;
    if (!event || !current) return;
    const rect = current.getBoundingClientRect();
    current.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
    current.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
  };
  document.addEventListener('pointermove', (event) => {
    const pane = (event.target as Element | null)?.closest<HTMLElement>('[data-glass]') ?? null;
    if (pane !== current) {
      current?.removeAttribute('data-glass-lit');
      current = pane;
      pane?.setAttribute('data-glass-lit', '');
    }
    if (!pane) return;
    if (!pending) requestAnimationFrame(apply);
    pending = event;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    current?.removeAttribute('data-glass-lit');
    current = null;
  });
}

/** Hold the scene still while scrolling, when every pane is already being repainted.
    Styled on the scene itself: toggling an attribute on <html> for every scroll event
    can restyle the whole document. */
function pauseSceneWhileScrolling() {
  const scene = document.querySelector<HTMLElement>('.liquid-scene');
  if (!scene) return;
  let timer = 0;
  addEventListener('scroll', () => {
    if (!timer) scene.style.animationPlayState = 'paused';
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = 0;
      scene.style.animationPlayState = '';
    }, 180);
  }, { passive: true });
}

export function mountLiquidGlass() {
  followPointer();
  pauseSceneWhileScrolling();
  if (!supportsRefraction()) return;
  const panes = [...document.querySelectorAll<HTMLElement>('[data-glass]')];
  // Build maps only for panes near the viewport, after the page has painted.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      refract(entry.target as HTMLElement);
    }
  }, { rootMargin: '400px 0px' });
  panes.forEach((pane) => observer.observe(pane));
}

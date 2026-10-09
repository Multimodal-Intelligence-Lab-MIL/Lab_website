# Glass UI and media rendering

Design references supplied for this update:

- https://github.com/KODxixi/Apple-UI — neutral glass, asymmetric edge highlights, quiet reading surfaces and restrained motion.
- https://github.com/Weiqin-Mo/Liquid-Glass-HTML — capsule navigation and controls, subtle depth and progressive browser fallbacks.

These are design references, not runtime dependencies. The site uses its own CSS in `src/styles/glass.css`. Navigation and open abstract panels use CSS backdrop blur; repeated reading cards use gradients, a light upper edge and layered shadows without per-card displacement maps or blur. Reduced motion, reduced transparency and forced colors have fallbacks.

## Images

`OptimizedImage.astro` resolves CMS media paths through `src/lib/media.ts`, then uses Astro's built-in image pipeline and Sharp at build time. Original files stay in `public/assets` and `public/uploads`, keeping existing admin uploads and links compatible. No image-processing library is sent to the browser.

- Avatars: up to 224 px wide, with 112/224 px responsive sources, explicit dimensions and asynchronous decoding. The first visible group loads eagerly; later portraits load lazily.
- Header logo: 42/84 px sources instead of the original 512 px file.
- Partner logos: small WebP sources, explicit dimensions and eager loading so they are fetched before the visitor reaches the section.
- Publication figures: responsive WebP sources in the catalogue; larger, higher-quality variants on detail pages.
- System fonts remove the cross-origin Google Fonts stylesheet and font requests.
- Astro prefetches navigation destinations on hover/focus to shorten subsequent page changes, respecting its data-saver behavior.

## Publications without artwork

`LabCover.astro` renders the lab's flowing title and a compact neural illustration using HTML, CSS and inline SVG. It makes no image requests and does not mount the homepage Canvas renderer. A shared IntersectionObserver enables animation only for visible covers; hidden tabs and reduced-motion settings pause animation. The cover remains visible without JavaScript. Both catalogue cards and detail pages use this component.

## Title bounds

The homepage title has a 1.2 line height and 0.18em bottom padding. The padding extends the gradient's painting area below descenders such as “g”, and adds separation before the introduction.

## Validation

Checked at 1440 px desktop, 390 px mobile and 320 px home widths in Chromium: cold-load partner logos, title bounds, local WebP image paths, publication filtering, abstract/BibTeX controls, mobile navigation, reduced motion, and absence of horizontal overflow or failed requests. No external fonts or UI libraries are fetched.

For the three portraits currently rendered on People, the default 2x image payload fell from 671.2 KiB to 31.9 KiB (95.2%). The header logo fell from 117 KiB to about 1.1 KiB. These are file-size comparisons, not claims about network latency on every visitor's connection.

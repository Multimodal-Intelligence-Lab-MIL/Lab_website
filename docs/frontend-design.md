# Glass UI and media rendering

Design references supplied for this update:

- https://github.com/KODxixi/Apple-UI — neutral glass, asymmetric edge highlights, quiet reading surfaces and restrained motion.
- https://github.com/Weiqin-Mo/Liquid-Glass-HTML — capsule navigation and controls, subtle depth and progressive browser fallbacks.

These are design references, not runtime dependencies. Apple's description of translucent, content-aware controls also informs the design: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/.

The site uses its own CSS in `src/styles/glass.css`, after iOS 26 Liquid Glass. A fixed `.liquid-scene` layer (in `BaseLayout.astro`) holds six large soft colour fields that drift on independent 30–52 s paths, so each pane picks up different light as the scene moves. Navigation, cards, logo tiles and controls are clear glass: about 20 % white fill, `backdrop-filter: blur() saturate()`, a softened 1 px edge and a gradient specular rim (bright at top left and bottom right). The earlier SVG displacement ("refraction") filter on the header was removed: below 2x pixel density Chromium clipped its blurred backdrop at the edges, which showed as a pale ring, and at 2x it was visually indistinguishable from plain blur. Reduced motion stops the scene; reduced transparency and forced colours switch to solid surfaces.

## Images

`OptimizedImage.astro` resolves CMS media paths through `src/lib/media.ts`, then uses Astro's built-in image pipeline and Sharp at build time. Original files stay in `public/assets` and `public/uploads`, keeping existing admin uploads and links compatible. No image-processing library is sent to the browser.

- Avatars: up to 224 px wide, with 112/224 px responsive sources, explicit dimensions and asynchronous decoding. The first visible group loads eagerly; later portraits load lazily.
- Header logo: 42/84 px sources instead of the original 512 px file.
- Partner logos: `scripts/prepare-logos.mjs` crops each logo and turns its white background transparent into `public/assets/logos/clean/`; the homepage sizes them to a similar visual area and loads them lazily. Run it again when adding a logo, then list the new file in `src/pages/index.astro`.
- Publication figures: 480/720/960 px WebP sources at quality 80 in the catalogue; up to 1200 px at quality 84 on detail pages.
- System fonts remove the cross-origin Google Fonts stylesheet and font requests.
- Astro prefetches navigation destinations on hover/focus to shorten subsequent page changes, respecting its data-saver behavior.

## Publications without artwork

`LabCover.astro` renders the lab's flowing title and a compact neural illustration using HTML, CSS and inline SVG. It makes no image requests and does not mount the homepage Canvas renderer. A shared IntersectionObserver enables animation only for visible covers; hidden tabs and reduced-motion settings pause animation. The cover remains visible without JavaScript. Both catalogue cards and detail pages use this component.

## Title bounds

The homepage title has a 1.2 line height and 0.18em bottom padding. The padding extends the gradient's painting area below descenders such as “g”, and adds separation before the introduction.

## Validation

Checked at 1440 px desktop, 390 px mobile and 320 px home widths in Chromium: cold-load partner logos, title bounds, local WebP image paths, publication filtering, abstract/BibTeX controls, mobile navigation, reduced motion, and absence of horizontal overflow or failed requests. No external fonts or UI libraries are fetched.

For the three portraits currently rendered on People, the default 2x image payload fell from 671.2 KiB to 31.9 KiB (95.2%). The header logo fell from 117 KiB to about 1.1 KiB. These are file-size comparisons, not claims about network latency on every visitor's connection.

## First-load follow-up

Public page styles are split by route. Research and Join no longer download homepage, People and publication layout rules. Their shared external CSS decreased from 38,861 to 17,267 bytes; small page-specific rules are inlined by Astro. All public pages and the independent admin screen use local system fonts, with no font stylesheet, font file or third-party UI runtime request.

The admin screen now has a small, hashed module entry and hashed CSS instead of sequential unbundled scripts. Its HTML decreased from 158,407 to 23,228 bytes (85.3%). The content snapshot and editor load in parallel after login, with a visible loading state and retry on failure; the BibTeX parser loads only when its import button is used. The static JSON snapshot URL includes a content digest. Initial media previews use 160 px local WebP images; refreshing the repository deliberately uses the newest GitHub commit to show newly uploaded artwork.

The homepage particle scene starts after initial painting, retaining its inline SVG fallback. Partner logos remain eager but have low fetch priority so they do not compete with the stylesheet. These changes reduce transfer and startup work; GitHub Pages connection latency still depends on the visitor's location and network.

Follow-up validation in Chromium: cold-cache Home/Research/Join/Admin requests under a 150 ms latency, 200 KB/s download and 4x CPU simulation; no font or cross-origin startup requests; 390 px Research/Join/Admin without overflow; fixed navigation, visible glass edges, cached refraction maps, reduced-transparency fallback and the Safari-user-agent CSS path. This is not a test in the actual Safari engine. Admin checks covered wrong credentials, a failed snapshot request followed by retry, editing all four collections, deferred BibTeX parsing, deletion URLs, logout/relogin and session restoration. Publication filtering, abstract/BibTeX controls, cold-load logos, title descenders and reduced motion also passed.

## Loading

- All CSS is inlined into each page (`build.inlineStylesheets: 'always'`), so no page waits on a separate stylesheet request.
- Header links are prefetched once a page is idle (`data-astro-prefetch="load"`); Chromium additionally prerenders a same-site page when the pointer rests on its link (speculation rules in `BaseLayout.astro`, excluding `/admin/`).
- Admin downloads its editor module and `admin/data.json` while the sign-in form is shown, so entering only has to render.

# Glass UI and media rendering

Design references supplied for this update:

- https://github.com/KODxixi/Apple-UI — neutral glass, asymmetric edge highlights, quiet reading surfaces and restrained motion.
- https://github.com/Weiqin-Mo/Liquid-Glass-HTML — capsule navigation and controls, subtle depth and progressive browser fallbacks.

These are design references, not runtime dependencies. Apple's description of translucent, content-aware controls also informs the design: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/.

The site uses its own CSS in `src/styles/glass.css`: a continuous, slowly moving pale blue scene, clear control centers, asymmetric 2.5–3 px edge highlights and inset shadows. The floating navigation reveals content while scrolling. In Chromium, `src/lib/liquid-glass.ts` prepares small cached displacement maps for the header and homepage research button after two animation frames and an idle callback. Maps regenerate only when dimensions change, never on each frame. Other browsers use CSS blur and edge lighting; repeated reading cards use translucent gradients without per-card displacement or blur. Reduced motion, reduced transparency and forced colors have fallbacks. The SVG-backed refraction is an enhancement and does not affect foreground text.

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

## First-load follow-up

Public page styles are split by route. Research and Join no longer download homepage, People and publication layout rules. Their shared external CSS decreased from 38,861 to 17,267 bytes; small page-specific rules are inlined by Astro. All public pages and the independent admin screen use local system fonts, with no font stylesheet, font file or third-party UI runtime request.

The admin screen now has a small, hashed module entry and hashed CSS instead of sequential unbundled scripts. Its HTML decreased from 158,407 to 23,228 bytes (85.3%). The content snapshot and editor load in parallel after login, with a visible loading state and retry on failure; the BibTeX parser loads only when its import button is used. The static JSON snapshot URL includes a content digest. Initial media previews use 160 px local WebP images; refreshing the repository deliberately uses the newest GitHub commit to show newly uploaded artwork.

The homepage particle scene starts after initial painting, retaining its inline SVG fallback. Partner logos remain eager but have low fetch priority so they do not compete with the stylesheet. These changes reduce transfer and startup work; GitHub Pages connection latency still depends on the visitor's location and network.

Follow-up validation in Chromium: cold-cache Home/Research/Join/Admin requests under a 150 ms latency, 200 KB/s download and 4x CPU simulation; no font or cross-origin startup requests; 390 px Research/Join/Admin without overflow; fixed navigation, visible glass edges, cached refraction maps, reduced-transparency fallback and the Safari-user-agent CSS path. This is not a test in the actual Safari engine. Admin checks covered wrong credentials, a failed snapshot request followed by retry, editing all four collections, deferred BibTeX parsing, deletion URLs, logout/relogin and session restoration. Publication filtering, abstract/BibTeX controls, cold-load logos, title descenders and reduced motion also passed.

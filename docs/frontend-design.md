# Glass UI and media rendering

Design references supplied for this update:

- https://github.com/KODxixi/Apple-UI — neutral glass, asymmetric edge highlights, quiet reading surfaces and restrained motion.
- https://github.com/Weiqin-Mo/Liquid-Glass-HTML — capsule navigation and controls, subtle depth and progressive browser fallbacks.

These are design references, not runtime dependencies. Apple's description of translucent, content-aware controls also informs the design: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/.

The site uses its own CSS in `src/styles/glass.css` and one script, `src/lib/liquid-glass.ts`.

- **Scene.** A fixed `.liquid-scene` element (in `BaseLayout.astro`) keeps the original pale blue-white wash; every colour stays between sky blue and cyan (hue about 190–205°), as an earlier lavender field read as a purple cast. Its soft colour fields and white light streaks are oversized background layers whose positions step along separate paths four times a second, and the scene holds still while the page scrolls (see Performance). It is deliberately one untransformed element: two oversized, rotating layers looked the same but made every frame expensive to composite.
- **Material (after Apple-UI).** Every `[data-glass]` pane has a low white tint, a dark hairline border, a bevel of inset light and shade for thickness, a 1 px specular rim (bright at the top left and bottom right), a soft gloss that follows the pointer, and a shadow that falls only below the pane.
- **Refraction (after Liquid-Glass-HTML, Chromium only).** For each pane near the viewport, the script draws a rounded-rectangle signed-distance map into a canvas once per size and applies it through an SVG `feDisplacementMap` in `backdrop-filter`. The backdrop is sampled from further inside within a narrow rim, so the scene and any content scrolling under the navigation bar bend at the edge while the centre stays clear. Safari and Firefox do not render SVG backdrop filters and keep the CSS material.
- **Tiers (`data-glass`).** `bar`: navigation, which also blurs content scrolling beneath it. `control`: buttons and pills, with a stronger rim. `panel`: tiles, filters and logos. `sheet`: large reading cards (people, publications, the news window, the Research page cards), which use the same material but switch the backdrop filter on only while hovered or focused. `float`: hover cards over other content (home research descriptions, Research page publication lists), with a denser tint and blur.
- **Hover cards.** A floating card is always a sibling of the pane it belongs to, inside a plain wrapper, never a child: a pane with a backdrop filter isolates the backdrop of everything inside it, so a nested card could not blur the page behind it. Cards appear after a short dwell (0.35 s on home, 0.45 s on Research); on touch screens the home description is shown in the tile and the Research list opens with its button.
- **Safari and Firefox.** BaseLayout marks engines without SVG backdrop filters (`data-glass-engine="css"`) before first paint. There `panel`, `control` and `sheet` panes drop their backdrop filter (it only added saturation) and the masked rim layer; the bevel carries the rim, and navigation and floating cards keep their blur. In a Safari user-agent run every page held 59–60 fps idle and scrolling.

Two Chromium behaviours shape this design and are worth keeping in mind when editing it:

1. An outer `box-shadow` on a pane, or on anything inside it, shifts its SVG backdrop filter by however far the shadow reaches left or up (1.5 × blur + spread − offset). The filtered area then starts that many pixels inside the pane, leaving pale strips along the top and left edges; this caused the white ring around the earlier navigation bar. All glass shadows therefore keep that reach at or below zero (`--glass-lift`, `--glass-lift-hover`). Inset shadows are unaffected.
2. A backdrop filter is recomputed whenever what lies behind it changes. With the scene moving every frame, many filtered panes made pages stutter. That is why the scene steps four times a second, pauses during scrolling, and why large cards filter only on hover.
3. Write the scene's animation with a name (or as longhands). The CSS minifier turned an unnamed shorthand such as `animation: 64s steps(64) infinite` into `animation: none`, which silently stopped the scene.

Reduced motion stops the scene; reduced transparency and forced colours switch to solid surfaces.

### Performance

Measured in headless Chromium at 2x pixel density, 1440 × 900, frames per second while idle / while scrolling. Software rendering makes the absolute numbers pessimistic; the comparison is what matters.

| Page | Before the glass redesign | First redesign (blur on every card) | Current |
| --- | --- | --- | --- |
| Home | 35 / 37 | 32 / 31 | 44 / 48 |
| People | 60 / 60 | 47 / 41 | 59 / 60 |
| Publications | 48 / 49 | 33 / 28 | 58 / 60 |

All with the scene moving. Home is lower throughout because of the animated neural core in its hero.

## Images

`OptimizedImage.astro` resolves CMS media paths through `src/lib/media.ts`, then uses Astro's built-in image pipeline and Sharp at build time. Original files stay in `public/assets` and `public/uploads`, keeping existing admin uploads and links compatible. No image-processing library is sent to the browser.

- Avatars: up to 224 px wide, with 112/224 px responsive sources, explicit dimensions and asynchronous decoding. The first visible group loads eagerly; later portraits load lazily.
- Header logo: 42/84 px sources instead of the original 512 px file.
- Partner logos: `scripts/prepare-logos.mjs` writes cropped versions to `public/assets/logos/clean/`. Logos that already have a transparent background are only cropped to their visible pixels (keeping white parts such as the UKRI lettering); opaque logos have their white background made transparent. The homepage sizes them to a similar visual area (`scale` enlarges marks with small type) and shows them in rows of three. To add one: put the file in `public/assets/logos/`, run `node scripts/prepare-logos.mjs <file> <output-name>`, then list `<output-name>.png` in `src/pages/index.astro`.
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

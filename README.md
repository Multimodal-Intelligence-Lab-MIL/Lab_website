# Multimodal Intelligence Lab Website

Static academic website and Git-backed content management system for the Multimodal Intelligence Lab at the University of Exeter.

## What is included

- Astro static site with Home, People, Publications, Research, News and Join Us pages.
- Lightweight `/admin/` gateway with a fixed local login and direct GitHub editing/upload links.
- GitHub Actions deployment to GitHub Pages.
- Content stored as Markdown/JSON and media stored under `public/uploads/`.
- Existing lab portraits, logos and selected publication figures migrated from the previous website.
- BibTeX-ready publication templates and default artwork for publications without an image.

## Local development

Requirements: Node.js 24 and pnpm.

```bash
pnpm install
pnpm dev
```

Build the same static output used by GitHub Pages:

```bash
pnpm check
pnpm build
```

The output is written to `dist/` and should not be committed.

## Before publishing

Follow [SETUP.md](SETUP.md). The repository and `/admin/` editing links are already configured for `Multimodal-Intelligence-Lab-MIL/Lab_website`; select GitHub Actions as the GitHub Pages source before publishing.

The full design and data-flow documentation is in [ARCHITECTURE.md](ARCHITECTURE.md).

# Multimodal Intelligence Lab Website

Static academic website and Git-backed content management system for the Multimodal Intelligence Lab at the University of Exeter.

## What is included

- Astro static site with Home, People, Publications, Research, News and Join Us pages.
- Decap CMS at `/admin/` for editing content and uploading images.
- GitHub Actions deployment to GitHub Pages.
- Content stored as Markdown/JSON and media stored under `public/uploads/`.
- Existing lab portraits, logos and selected publication figures migrated from the previous website.
- BibTeX-aware publication editor and default artwork for publications without an image.

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

Follow [SETUP.md](SETUP.md). The repository is already configured for `Multimodal-Intelligence-Lab-MIL/Lab_website`; add the OAuth proxy value in `public/admin/config.yml` before enabling admin login, then select GitHub Actions as the GitHub Pages source.

The full design and data-flow documentation is in [ARCHITECTURE.md](ARCHITECTURE.md).

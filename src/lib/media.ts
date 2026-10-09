import type { ImageMetadata } from 'astro';

// Resolve CMS paths at build time so new uploads automatically get optimized too.
const localImages = import.meta.glob<{ default: ImageMetadata }>(
  '/public/{assets,uploads}/**/*.{png,jpg,jpeg,webp,avif}'
);

export async function localImage(path: string) {
  const load = localImages[`/public/${path.replace(/^\/+/, '')}`];
  return load ? (await load()).default : undefined;
}

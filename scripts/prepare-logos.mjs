// Turns partner logos into tightly cropped PNGs that sit directly on the glass cards.
// Logos that already have a transparent background are only cropped, which keeps any
// white parts of the mark (such as the UKRI lettering). Opaque logos have their white
// background made transparent instead.
// Usage: node scripts/prepare-logos.mjs <source-in-public/assets/logos> <output-name> ...
import sharp from 'sharp';

const sourceDir = 'public/assets/logos';
const outputDir = 'public/assets/logos/clean';
const pairs = process.argv.slice(2);

for (let i = 0; i < pairs.length; i += 2) {
  const [source, name] = [pairs[i], pairs[i + 1]];
  const { isOpaque } = await sharp(`${sourceDir}/${source}`).stats();
  if (!isOpaque) {
    // Crop to the visible pixels. trim() compares against the top-left pixel, which in
    // marks such as UKRI's is the logo itself rather than empty space.
    const { data, info } = await sharp(`${sourceDir}/${source}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let left = info.width, top = info.height, right = -1, bottom = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] <= 8) continue;
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
    await sharp(`${sourceDir}/${source}`).ensureAlpha()
      .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
      .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 }).toFile(`${outputDir}/${name}.png`);
    const { width, height } = await sharp(`${outputDir}/${name}.png`).metadata();
    console.log(`${source} -> ${name}.png ${width}x${height} (kept transparency)`);
    continue;
  }
  // Flatten in its own pass: within one pipeline sharp trims before flattening.
  const flattened = await sharp(`${sourceDir}/${source}`).flatten({ background: '#ffffff' }).png().toBuffer();
  const flat = await sharp(flattened)
    .trim({ background: '#ffffff', threshold: 24 })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: '#ffffff' })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = flat;
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    // "Colour to alpha" against white: keeps the logo identical over white,
    // and lets lighter pixels become proportionally transparent.
    const alpha = Math.max(255 - data[p], 255 - data[p + 1], 255 - data[p + 2]) / 255;
    for (let c = 0; c < 3; c++) out[q + c] = alpha ? Math.round(255 - (255 - data[p + c]) / alpha) : 255;
    out[q + 3] = Math.round(alpha * 255);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 }).toFile(`${outputDir}/${name}.png`);
  console.log(`${source} -> ${name}.png ${info.width}x${info.height}`);
}

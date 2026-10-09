// Turns partner logos into tightly cropped PNGs whose white background becomes
// transparent, so they sit directly on the glass cards without a white box.
// Usage: node scripts/prepare-logos.mjs <source-in-public/assets/logos> <output-name> ...
import sharp from 'sharp';

const sourceDir = 'public/assets/logos';
const outputDir = 'public/assets/logos/clean';
const pairs = process.argv.slice(2);

for (let i = 0; i < pairs.length; i += 2) {
  const [source, name] = [pairs[i], pairs[i + 1]];
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

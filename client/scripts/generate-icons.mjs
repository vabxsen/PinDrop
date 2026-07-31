// One-off asset generator: run with `npm run generate:icons` whenever logo.png
// changes. Produces favicons, the apple touch icon, and the OG/Twitter share
// image from the single source logo in public/logo.png.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const publicDir = path.resolve(fileURLToPath(import.meta.url), '../../public');
const logoPath = path.join(publicDir, 'logo.png');

const BRAND_PURPLE = '#5330f0';

async function generateFavicons() {
  const sizes = [16, 32];
  const buffers = {};

  for (const size of sizes) {
    const buf = await sharp(logoPath).resize(size, size, { fit: 'contain' }).png().toBuffer();
    buffers[size] = buf;
    await writeFile(path.join(publicDir, `favicon-${size}x${size}.png`), buf);
  }

  const icoSourceSizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    icoSourceSizes.map((size) =>
      sharp(logoPath).resize(size, size, { fit: 'contain' }).png().toBuffer(),
    ),
  );
  const icoBuffer = await pngToIco(icoBuffers);
  await writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // A white background makes the icon's own white-shaded facets vanish into
  // it, so — same as the OG image — invert to white and place it on the
  // brand-purple background instead, which keeps full contrast.
  const whiteIconForTouch = await sharp(logoPath)
    .resize(100, 100, { fit: 'contain' })
    .negate({ alpha: false })
    .png()
    .toBuffer();
  const appleTouchIcon = await sharp({
    create: { width: 180, height: 180, channels: 4, background: BRAND_PURPLE },
  })
    .composite([{ input: whiteIconForTouch, gravity: 'center' }])
    .png()
    .toBuffer();
  await writeFile(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
}

async function generateOgImage() {
  // logo.png is a dark icon meant to be shown with a CSS `invert` filter on
  // dark backgrounds (see Logo.tsx) — negate it here to get the same white
  // icon for contrast against the brand-purple OG background.
  const whiteIcon = await sharp(logoPath)
    .resize(320, 320, { fit: 'contain' })
    .negate({ alpha: false })
    .png()
    .toBuffer();

  const ogImage = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: BRAND_PURPLE,
    },
  })
    .composite([{ input: whiteIcon, gravity: 'center' }])
    .png()
    .toBuffer();

  await writeFile(path.join(publicDir, 'og-image.png'), ogImage);
}

await generateFavicons();
await generateOgImage();

console.log('Generated favicon-16x16.png, favicon-32x32.png, favicon.ico, apple-touch-icon.png, og-image.png');

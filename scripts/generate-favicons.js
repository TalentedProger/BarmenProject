import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../client/public/favicon.svg');
const publicDir = join(__dirname, '../client/public');

// Read SVG content
const svgContent = readFileSync(svgPath, 'utf-8');
const svgBuffer = Buffer.from(svgContent);

// Generate different sizes
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'og-icon.png', size: 512 }, // For Open Graph
];

async function generateFavicons() {
  console.log('Generating favicon PNGs from SVG...');
  
  for (const { name, size } of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 10, g: 10, b: 13, alpha: 1 } // #0A0A0D
        })
        .png()
        .toFile(join(publicDir, name));
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (err) {
      console.error(`✗ Failed to generate ${name}:`, err.message);
    }
  }
  
  console.log('\nDone! All favicons generated.');
}

generateFavicons();

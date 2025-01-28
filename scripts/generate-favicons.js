const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Base SVG for the favicon - a simple "MLP" text
const generateSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#4F46E5"/>
  <text x="50%" y="50%" font-family="Arial" font-weight="bold" font-size="${size/2.5}px" 
        fill="white" text-anchor="middle" dominant-baseline="middle">
    MLP
  </text>
</svg>
`;

async function generateFavicon(size, outputName) {
  const outputPath = path.join(__dirname, '..', 'public', outputName);
  const svgBuffer = Buffer.from(generateSVG(size));
  
  await sharp(svgBuffer)
    .png()
    .toFile(outputPath);
  
  console.log(`Generated ${outputName}`);
}

async function main() {
  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' }
  ];

  for (const { size, name } of sizes) {
    await generateFavicon(size, name);
  }
}

main().catch(console.error);

import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'mp-logo.png');
    const faviconDir = path.join(process.cwd(), 'public', 'favicon');

    // Ensure favicon directory exists
    await fs.mkdir(faviconDir, { recursive: true });

    // Generate different favicon sizes
    for (const size of FAVICON_SIZES) {
      await sharp(logoPath)
        .resize(size, size)
        .toFile(path.join(faviconDir, `favicon-${size}x${size}.png`));
    }

    // Generate .ico file (16x16 and 32x32)
    await sharp(logoPath)
      .resize(32, 32)
      .toFile(path.join(process.cwd(), 'public', 'favicon.ico'));

    // Generate apple-touch-icon
    await sharp(logoPath)
      .resize(180, 180)
      .toFile(path.join(faviconDir, 'apple-touch-icon.png'));

    res.status(200).json({ message: 'Favicons generated successfully' });
  } catch (error) {
    console.error('Error generating favicons:', error);
    res.status(500).json({ message: 'Error generating favicons' });
  }
}

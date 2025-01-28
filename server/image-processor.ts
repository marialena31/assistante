import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { BLOG_IMAGE_SIZES, ImageSize } from '../utils/images';

export const processImage = async (
  inputPath: string,
  outputDir: string,
  filename: string
): Promise<void> => {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });

  // Process images for each size
  await Promise.all(
    Object.entries(BLOG_IMAGE_SIZES).map(async ([size, dimensions]) => {
      const { width, height } = dimensions;
      const outputPath = path.join(
        outputDir,
        `${path.parse(filename).name}${size === 'full' ? '' : `-${size}`}.webp`
      );

      await image
        .resize(width, height, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
    })
  );
};

export const deleteImages = async (filename: string, outputDir: string): Promise<void> => {
  const basename = path.parse(filename).name;
  
  // Delete all size variants
  await Promise.all(
    Object.keys(BLOG_IMAGE_SIZES).map(async (size) => {
      const imagePath = path.join(
        outputDir,
        `${basename}${size === 'full' ? '' : `-${size}`}.webp`
      );
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        // Ignore errors if file doesn't exist
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    })
  );
};

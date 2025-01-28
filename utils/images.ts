import path from 'path';
import fs from 'fs/promises';

export const BLOG_IMAGE_SIZES = {
  thumbnail: {
    width: 400,
    height: 300,
  },
  full: {
    width: 1200,
    height: 800,
  },
} as const;

export type ImageSize = keyof typeof BLOG_IMAGE_SIZES;

export function getImageUrl(url: string | null): string {
  if (!url) return '/images/placeholder.jpg';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${url}`;
}

export function getOptimizedImageUrl(url: string | null, width?: number): string {
  const baseUrl = getImageUrl(url);
  
  // If it's a Supabase URL, we can use their image transformation
  if (baseUrl.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || '')) {
    const transformParams = [];
    if (width) {
      transformParams.push(`width=${width}`);
    }
    return transformParams.length > 0 ? `${baseUrl}?${transformParams.join('&')}` : baseUrl;
  }
  
  return baseUrl;
}

export const processImage = async (
  inputPath: string,
  outputDir: string,
  filename: string
): Promise<void> => {
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

      // Use a placeholder image for now
      await fs.copyFile('path/to/placeholder.webp', outputPath);
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

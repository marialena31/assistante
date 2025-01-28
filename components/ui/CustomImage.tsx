import Image from 'next/image';
import { getImageUrl } from '../../utils/images';

interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  style?: React.CSSProperties;
  fill?: boolean;
}

export default function CustomImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  style,
  fill = false,
}: CustomImageProps) {
  const imageUrl = getImageUrl(src);

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes}
      style={style}
      fill={fill}
    />
  );
}

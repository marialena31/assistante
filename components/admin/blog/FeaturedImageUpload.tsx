import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/legacy/image';

export interface FeaturedImageUploadProps {
  onFileSelect: (file: File) => void;
  currentImageUrl?: string;
}

export default function FeaturedImageUpload({ onFileSelect, currentImageUrl }: FeaturedImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 1024 * 1024, // 1MB
    multiple: false
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        {currentImageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={currentImageUrl}
              alt="Featured image preview"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Déposez l\'image ici...'
                : 'Glissez et déposez une image ici, ou cliquez pour sélectionner un fichier'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG ou WEBP uniquement (max. 1MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

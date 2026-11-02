import React, { useState, useEffect } from 'react';
import { getSeamlessFallbackDataUri } from '../utils/studioSvgAssets';

interface StudioImageProps {
  src: string;
  alt: string;
  className?: string;
  vignette?: boolean;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export const StudioImage: React.FC<StudioImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      onClick={onClick}
      onError={() => {
        const fallback = getSeamlessFallbackDataUri(alt.toUpperCase());
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      className={`grayscale contrast-125 brightness-95 select-none ${className}`}
    />
  );
};

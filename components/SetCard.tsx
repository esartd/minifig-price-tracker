'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SetCardImageProps {
  imageUrl: string;
  setName: string;
  width?: number;
  height?: number;
  maxHeight?: string;
}

export default function SetCardImage({
  imageUrl,
  setName,
  width = 180,
  height = 180,
  maxHeight = '180px'
}: SetCardImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  if (!imageUrl || imageError) {
    return <div style={{ fontSize: '72px', opacity: 0.3 }}>📦</div>;
  }

  return (
    <Image
      src={currentImageUrl}
      alt={setName}
      width={width}
      height={height}
      style={{ objectFit: 'contain', maxHeight }}
      unoptimized
      onError={(e) => {
        // Try SN format if ON format fails
        if (currentImageUrl.includes('/ON/')) {
          const snUrl = currentImageUrl.replace('/ON/', '/SN/');
          if (e.currentTarget.src !== snUrl) {
            setCurrentImageUrl(snUrl);
            return;
          }
        }
        setImageError(true);
      }}
    />
  );
}

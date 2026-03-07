'use client';

import { useState } from 'react';
import type { ShopifyImage } from '@/lib/shopify/types';
import { ImageGallery } from './ImageGallery';
import { ImageZoom } from './ImageZoom';

interface ImageGalleryWithZoomClientProps {
  images: ShopifyImage[];
  productTitle: string;
}

export function ImageGalleryWithZoomClient({
  images,
  productTitle,
}: ImageGalleryWithZoomClientProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setZoomIndex(index);
    setZoomOpen(true);
  };

  return (
    <>
      <ImageGallery
        images={images}
        productTitle={productTitle}
        onImageClick={handleImageClick}
      />
      <ImageZoom
        images={images}
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        currentIndex={zoomIndex}
        onIndexChange={setZoomIndex}
      />
    </>
  );
}

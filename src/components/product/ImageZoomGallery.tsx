'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShopifyImage } from '@/lib/shopify/types';
import { ImageZoom } from './ImageZoom';

interface ImageZoomGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
}

export function ImageZoomGallery({ images, productTitle }: ImageZoomGalleryProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  if (!images.length) return null;

  const openZoom = (index: number) => {
    setZoomIndex(index);
    setZoomOpen(true);
  };

  return (
    <>
      {/* Horizontal scrollable strip */}
      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => openZoom(i)}
            aria-label={`View ${productTitle} — image ${i + 1}`}
            className="flex-shrink-0 relative overflow-hidden cursor-zoom-in group"
            style={{ width: 'clamp(160px, 22vw, 260px)', aspectRatio: '3/4' }}
          >
            <Image
              src={img.url}
              alt={img.altText || `${productTitle} — ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

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

//src/components/product/ImageGallery.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

interface ImageGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
  productHandle?: string;
  onImageClick?: (index: number) => void;
}

export function ImageGallery({
  images,
  productTitle,
  productHandle,
  onImageClick,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  if (!images.length) {
    return (
      <div className="bg-stone-100 flex items-center justify-center">
        <span className="text-label text-muted">No image</span>
      </div>
    );
  }

  const mainImage = images[selectedIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50 && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (delta > 50 && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:h-full">
      {/* Main image — first in DOM = top on mobile */}
      <div
        className="relative w-full aspect-square md:aspect-auto md:flex-1 overflow-hidden cursor-zoom-in select-none"
        style={
          productHandle
            ? ({
                viewTransitionName: `product-image-${productHandle}`,
              } as React.CSSProperties)
            : undefined
        }
        onClick={() => onImageClick?.(selectedIndex)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={mainImage.url}
          alt={mainImage.altText || productTitle}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Dot indicators — mobile only, overlaid on image */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full bg-white transition-all duration-200 drop-shadow-sm",
                  i === selectedIndex ? "w-4 opacity-100" : "w-1.5 opacity-50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails — desktop sidebar only */}
      {images.length > 1 && (
        <div className="hidden md:flex md:flex-col md:order-first md:overflow-y-auto md:w-14 md:flex-shrink-0 gap-2 mr-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "flex-shrink-0 relative w-14 h-14 border rounded-lg transition-all duration-200 overflow-hidden",
                i === selectedIndex
                  ? "border-black"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-stroke",
              )}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productTitle} — image ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

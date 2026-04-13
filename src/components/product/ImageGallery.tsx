//src/components/product/ImageGallery.tsx
"use client";

import React, { useState } from "react";
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

  if (!images.length) {
    return (
      <div className="bg-stone-100 flex items-center justify-center">
        <span className="text-label text-muted">No image</span>
      </div>
    );
  }

  const mainImage = images[selectedIndex];

  return (
    <div className="flex flex-col md:flex-row md:h-full">
      {/* Main image — comes first in DOM so it's on top on mobile */}
      <div
        className="relative w-full aspect-square md:aspect-auto md:flex-1 overflow-hidden cursor-zoom-in"
        style={
          productHandle
            ? ({
                viewTransitionName: `product-image-${productHandle}`,
              } as React.CSSProperties)
            : undefined
        }
        onClick={() => onImageClick?.(selectedIndex)}
      >
        <Image
          src={mainImage.url}
          alt={mainImage.altText || productTitle}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails — bottom bar on mobile, left sidebar on desktop (sm:order-first) */}
      {images.length > 1 && (
        <div className="flex flex-row overflow-x-auto gap-2 py-2 md:order-first md:flex-col md:overflow-x-hidden md:overflow-y-auto md:w-14 md:flex-shrink-0">
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

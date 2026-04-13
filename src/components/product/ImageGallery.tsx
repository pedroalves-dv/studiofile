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
      <div className="aspect-square bg-stone-100 flex items-center justify-center">
        <span className="text-label text-muted">No image</span>
      </div>
    );
  }

  const mainImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-square bg-stone-50 overflow-hidden cursor-zoom-in"
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

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "flex-shrink-0 relative w-16 h-16 border-2 transition-all duration-200 overflow-hidden",
                i === selectedIndex
                  ? "border-ink"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-border",
              )}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productTitle} — image ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

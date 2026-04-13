//src/components/product/ImageGalleryWithZoom.tsx
"use client";

import { useState } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";
import { ImageGallery } from "./ImageGallery";
import { ImageZoom } from "./ImageZoom";

interface ImageGalleryWithZoomProps {
  images: ShopifyImage[];
  productTitle: string;
  productHandle?: string;
}

export function ImageGalleryWithZoom({
  images,
  productTitle,
  productHandle,
}: ImageGalleryWithZoomProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setZoomIndex(index);
    setZoomOpen(true);
  };

  return (
    <div className="h-full w-full">
      <ImageGallery
        images={images}
        productTitle={productTitle}
        productHandle={productHandle}
        onImageClick={handleImageClick}
      />
      <ImageZoom
        images={images}
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        currentIndex={zoomIndex}
        onIndexChange={setZoomIndex}
      />
    </div>
  );
}

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ShopifyImage } from '@/lib/shopify/types';
import { cn } from '@/lib/utils/cn';

interface ImageZoomProps {
  images: ShopifyImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageZoom({
  images,
  open,
  onOpenChange,
  currentIndex,
  onIndexChange,
}: ImageZoomProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const goNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  const goPrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, goNext, goPrev, onOpenChange]);

  if (!open || !images.length) return null;

  const current = images[currentIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/96"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close */}
      <button
        ref={closeButtonRef}
        onClick={() => onOpenChange(false)}
        aria-label="Close image viewer"
        className="absolute top-5 right-5 z-10 p-2 text-canvas/70 hover:text-canvas transition-colors"
      >
        <X size={24} />
      </button>

      {/* Main image area */}
      <div
        className="relative w-full max-w-5xl px-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-4 p-2 text-canvas/70 hover:text-canvas transition-colors"
          >
            <ChevronLeft size={36} />
          </button>
        )}

        <div className="relative w-full" style={{ height: '65vh' }}>
          <Image
            src={current.url}
            alt={current.altText || 'Product image'}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-4 p-2 text-canvas/70 hover:text-canvas transition-colors"
          >
            <ChevronRight size={36} />
          </button>
        )}
      </div>

      {/* Thumbnail strip + counter */}
      {images.length > 1 && (
        <div
          className="flex flex-col items-center gap-3 mt-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1 px-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === currentIndex ? 'true' : undefined}
                className={cn(
                  'flex-shrink-0 w-14 h-14 relative border-2 transition-all duration-200',
                  i === currentIndex
                    ? 'border-accent'
                    : 'border-transparent opacity-50 hover:opacity-80'
                )}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `Image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
          <p className="text-label text-canvas/50">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>,
    document.body
  );
}

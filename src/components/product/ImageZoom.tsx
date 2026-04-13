"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ShopifyImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/cn";

interface ImageZoomProps {
  images: ShopifyImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const ANIMATION_DURATION = 250;

export function ImageZoom({
  images,
  open,
  onOpenChange,
  currentIndex,
  onIndexChange,
}: ImageZoomProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Two-phase state: mounted = in DOM, visible = CSS transition target
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Mobile skip — no zoom modal on small screens
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (open && !isMobile) {
      clearTimeout(closeTimerRef.current);
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      closeTimerRef.current = setTimeout(
        () => setMounted(false),
        ANIMATION_DURATION,
      );
    }
    return () => clearTimeout(closeTimerRef.current);
  }, [open, isMobile]);

  // Focus management
  useEffect(() => {
    if (visible) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const goNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  const goPrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, goNext, goPrev, onOpenChange]);

  if (!mounted || !images.length) return null;

  const current = images[currentIndex];
  const transitionBase = `transition-all duration-[${ANIMATION_DURATION}ms] ease-out`;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[60] mt-[var(--header-height)] sm:mr-[1px] flex flex-col items-center justify-center",
        // Background fades in/out independently
        "bg-canvas",
        transitionBase,
        visible ? "opacity-100" : "opacity-0",
      )}
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Main image area — scales up on open, stays put on close */}
      <div
        className={cn(
          "relative w-full max-w-6xl flex items-center justify-center",
          transitionBase,
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          onClick={() => onOpenChange(false)}
          aria-label="Close image viewer"
          className="absolute -top-5 right-1 z-10 p-4 text-ink hover:text-light transition-colors"
        >
          <X size={24} />
        </button>
        {images.length > 1 && (
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="p-4 text-ink hover:text-light transition-colors"
          >
            <ChevronLeft size={30} />
          </button>
        )}

        <div className="relative w-full" style={{ height: "75vh" }}>
          <Image
            src={current.url}
            alt={current.altText || "Product image"}
            fill
            className="object-contain"
            sizes="(max-width: 960px) 100vw, 80vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={goNext}
            aria-label="Next image"
            className="p-4 text-ink hover:text-light transition-colors"
          >
            <ChevronRight size={30} />
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
                aria-current={i === currentIndex ? "true" : undefined}
                className={cn(
                  "flex-shrink-0 w-14 h-14 relative border rounded-lg transition-all duration-200",
                  i === currentIndex
                    ? "border-ink"
                    : "border-transparent opacity-50 hover:opacity-80",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `Image ${i + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
          <p className="text-label text-ink">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>,
    document.body,
  );
}

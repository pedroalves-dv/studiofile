"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

type PanelState = "open" | "closing" | "closed";

const CLOSE_DURATION = 300;

interface BottomSheetProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({
  title,
  isOpen,
  onClose,
  children,
}: BottomSheetProps) {
  const [state, setState] = useState<PanelState>("closed");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef(0);

  // Sync external isOpen → internal state machine
  useEffect(() => {
    if (isOpen && state === "closed") {
      setState("open");
    } else if (!isOpen && state === "open") {
      setState("closing");
      timerRef.current = setTimeout(() => {
        setState("closed");
        timerRef.current = null;
      }, CLOSE_DURATION);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (state === "closed") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state, onClose]);

  useScrollLock(state !== "closed");

  if (state === "closed") return null;

  const isClosing = state === "closing";

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40"
        style={{
          animation: `${isClosing ? "fadeOut" : "fadeIn"} ${CLOSE_DURATION}ms ease-in-out forwards`,
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 flex flex-col bg-canvas"
        style={{
          height: "calc(100dvh - var(--header-height))",
          animation: `${isClosing ? "sheetSlideDown" : "sheetSlideUp"} ${CLOSE_DURATION}ms ease-in-out forwards`,
        }}
        onTouchStart={(e) => {
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientY - touchStartY.current;
          if (delta > 80) onClose();
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-ink/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-site py-3 border-b border-stroke flex-shrink-0">
          <span className="text-4xl font-medium tracking-tighter">{title}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-end rounded-full text-ink hover:text-ink hover:bg-ink/40 transition-colors"
            aria-label="Close"
          >
            <X size={28} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}

// src/components/common/ScrollSnapProvider.tsx
"use client";

import { useScrollSnap } from "@/hooks/useScrollSnap";

export function ScrollSnapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useScrollSnap();

  return <>{children}</>;
}

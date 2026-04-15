"use client";

import { ArrowButton } from "@/components/ui/ArrowButton";

export function EmptyCart() {
  return (
    <div className="flex flex-col h-full px-site">
      <div className="py-6">
        <p className="text-6xl sm:text-7xl font-medium tracking-[-0.06em] leading-[0.9]">
          Your cart is empty
        </p>
      </div>
      <ArrowButton
        href="/products"
        label="Shop"
        className="w-fit px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.03em] rounded-lg border border-ink disabled:opacity-50"
      />
    </div>
  );
}

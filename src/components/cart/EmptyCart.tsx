"use client";

import { ArrowButton } from "@/components/ui/ArrowButton";

export function EmptyCart() {
  return (
    <div className="flex flex-col h-full gap-6 pb-24">
      <div className="py-4">
        <p className="text-7xl font-medium tracking-[-0.07em] sm:leading-[0.9] leading-[4rem]">
          Your cart is empty
        </p>
      </div>
      <ArrowButton
        href="/products"
        label="Shop"
        className="w-fit px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md border border-ink disabled:opacity-50"
      />
    </div>
  );
}

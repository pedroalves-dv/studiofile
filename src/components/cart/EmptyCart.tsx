"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ArrowButton } from "@/components/ui/ArrowButton";

export function EmptyCart() {
  const { closeCart } = useCart();

  return (
    <div className="flex flex-col h-full gap-6 pb-24">
      {/* <ShoppingBag size={48} className="text-light" /> */}
      <div className="py-4">
        <p className="text-7xl font-semibold tracking-[-0.07em] sm:leading-[0.9] leading-[4rem]">
          Your cart is empty
        </p>
        {/* <p className="font-mono text-light mt-4">Add something beautiful.</p> */}
      </div>
      <ArrowButton
        href="/shop"
        label="Shop"
        className="w-fit px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md border border-ink disabled:opacity-50"
      />
    </div>
  );
}

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
        <p className="font-inter font-medium tracking-tighter text-7xl leading-none">
          Your cart is empty
        </p>
        {/* <p className="font-mono text-light mt-4">Add something beautiful.</p> */}
      </div>
      <ArrowButton
        href="/shop"
        label="Shop"
        className="h-12 w-28 px-8 py-3 bg-ink text-white text-xs 
                          tracking-display font-mono rounded-xl flex items-center 
                          justify-center self-start "
      />
    </div>
  );
}

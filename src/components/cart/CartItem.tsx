"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import type { ShopifyCartLine } from "@/lib/shopify/types";

interface CartItemProps {
  line: ShopifyCartLine;
}

export function CartItem({ line }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [localQuantity, setLocalQuantity] = useState(line.quantity);

  useEffect(() => {
    if (localQuantity === line.quantity) return;
    const timer = setTimeout(() => {
      updateItem(line.id, localQuantity);
    }, 500);
    return () => clearTimeout(timer);
  }, [localQuantity]);

  const { merchandise } = line;

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-16 h-16 bg-stone-100 relative overflow-hidden">
        {merchandise.image ? (
          <Image
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? merchandise.product.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-stone-200" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-3xl font-semibold tracking-tighter leading-none text-ink truncate">
          {merchandise.product.title}
        </p>
        {merchandise.title !== "Default Title" && (
          <p className="text-xs text-muted mt-0.5">{merchandise.title}</p>
        )}
        {line.attributes.filter((a) => !a.key.startsWith("_")).length > 0 && (
          <p className="text-xs text-muted mt-0.5">
            {line.attributes
              .filter((a) => !a.key.startsWith("_"))
              .map((a) => a.value)
              .join(" · ")}
          </p>
        )}
        <p className="text-xs text-muted mt-1">
          {formatPrice(
            merchandise.price.amount,
            merchandise.price.currencyCode,
          )}
        </p>

        {/* Out of stock warning */}
        {!merchandise.availableForSale && (
          <p className="text-xs text-error mt-1">Out of stock</p>
        )}

        {/* Quantity stepper + line total */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocalQuantity((q) => Math.max(0, q - 1))}
              aria-label="Decrease quantity"
              className="w-6 h-6 flex items-center justify-center border border-border hover:border-ink transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs w-4 text-center">{localQuantity}</span>
            <button
              onClick={() => setLocalQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-6 h-6 flex items-center justify-center border border-border hover:border-ink transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs">
              {formatPrice(
                line.cost.totalAmount.amount,
                line.cost.totalAmount.currencyCode,
              )}
            </span>
            <button
              onClick={() => removeItem(line.id)}
              aria-label={`Remove ${merchandise.product.title}`}
              className="text-muted hover:text-error transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

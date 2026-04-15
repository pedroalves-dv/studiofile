// src/components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils/format";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { ShopifyCartLine } from "@/lib/shopify/types";

interface CartItemProps {
  line: ShopifyCartLine;
}

export function CartItem({ line }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [localQuantity, setLocalQuantity] = useState(line.quantity);

  const updateItemRef = useRef(updateItem);
  updateItemRef.current = updateItem;

  const pendingRef = useRef<{ lineId: string; quantity: number } | null>(null);

  useEffect(() => {
    if (!pendingRef.current) {
      setLocalQuantity(line.quantity);
    }
  }, [line.quantity]);

  useEffect(() => {
    if (localQuantity === line.quantity) {
      pendingRef.current = null;
      return;
    }
    pendingRef.current = { lineId: line.id, quantity: localQuantity };

    const timer = setTimeout(() => {
      pendingRef.current = null;
      updateItemRef.current(line.id, localQuantity);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (pendingRef.current) {
        updateItemRef.current(
          pendingRef.current.lineId,
          pendingRef.current.quantity,
        );
        pendingRef.current = null;
      }
    };
  }, [localQuantity, line.quantity, line.id]);

  const { merchandise } = line;

  return (
    <div className="flex gap-4 p-2 border border-stroke rounded-lg">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-24 aspect-square bg-stone-100 relative overflow-hidden">
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
        <p className="text-2xl font-semibold tracking-tighter leading-none text-ink truncate">
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
          <QuantityStepper
            value={localQuantity}
            onChange={setLocalQuantity}
            size="sm"
            max={line.merchandise.quantityAvailable ?? 999}
          />

          <div className="flex items-center gap-3 leading-none">
            <span className="text-base mt-0.5">
              {formatPrice(
                line.cost.totalAmount.amount,
                line.cost.totalAmount.currencyCode,
              )}
            </span>
            <button
              onClick={() => removeItem(line.id)}
              aria-label={`Remove ${merchandise.product.title}`}
              className="flex items-center text-muted hover:text-error transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

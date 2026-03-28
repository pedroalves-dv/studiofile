"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/common/Toast";
import { cn } from "@/lib/utils/cn";
import type { ShopifyCartLine } from "@/lib/shopify/types";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { generateUid } from "@/lib/utils/uid";
import type { TotemPiece } from "@/lib/totem-config";

interface TotemCartGroupProps {
  lines: ShopifyCartLine[];
}

function getLineLabel(line: ShopifyCartLine): {
  primary: string;
  secondary?: string;
} {
  const part = line.attributes.find((a) => a.key === "Part")?.value;
  const productTitle = line.merchandise.product.title;
  const variantTitle = line.merchandise.title;
  if (part === "Shape" || part === "Fixation") {
    return { primary: productTitle, secondary: variantTitle };
  }
  return { primary: productTitle };
}

function lineAttr(line: ShopifyCartLine, key: string): string | undefined {
  return line.attributes.find((a) => a.key === key)?.value;
}

export function TotemCartGroup({ lines }: TotemCartGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { removeBundleItems, closeCart } = useCart();
  const router = useRouter();
  const toast = useToast();

  const busy = isRemoving || isEditing;

  const totalAmount = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "EUR";


  async function confirmRemove() {
    setIsRemoving(true);
    try {
      await removeBundleItems(lines.map((l) => l.id));
    } catch {
      // error already toasted inside removeBundleItems
    } finally {
      setIsRemoving(false);
      setConfirming(false);
    }
  }

  async function handleEdit() {
    setIsEditing(true);
    try {
      const shapeLines = lines.filter((l) => lineAttr(l, "Part") === "Shape");
      const fixLine = lines.find((l) => lineAttr(l, "Part") === "Fixation");
      const cabLine = lines.find((l) => lineAttr(l, "Part") === "Cable");

      if (
        shapeLines.some(
          (l) => !lineAttr(l, "_shape_id") || !lineAttr(l, "_color_id"),
        ) ||
        !fixLine ||
        !lineAttr(fixLine, "_fixation_id") ||
        !lineAttr(fixLine, "_fixation_color_id") ||
        !cabLine ||
        !lineAttr(cabLine, "_cable_id")
      ) {
        toast.error("Could not reconstruct config. Please build a new TOTEM.");
        return;
      }

      const pieces: TotemPiece[] = shapeLines.map((l) => ({
        uid: generateUid(),
        shapeId: lineAttr(l, "_shape_id")!,
        colorId: lineAttr(l, "_color_id")!,
        flipped: lineAttr(l, "_flipped") === "true",
      }));

      localStorage.setItem("sf-totem-pieces", JSON.stringify(pieces));
      localStorage.setItem(
        "sf-totem-fixation",
        JSON.stringify(lineAttr(fixLine, "_fixation_id")),
      );
      localStorage.setItem(
        "sf-totem-fixation-color",
        JSON.stringify(lineAttr(fixLine, "_fixation_color_id")),
      );
      localStorage.setItem(
        "sf-totem-cable",
        JSON.stringify(lineAttr(cabLine, "_cable_id")),
      );

      await removeBundleItems(lines.map((l) => l.id));
      closeCart();
      router.push("/products/totem");
    } catch {
      toast.error("Could not edit bundle. Please try again.");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <div className="py-4 border-b border-stroke last:border-b-0">
      {/* Collapsed header — full-width button */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse TOTEM bundle" : "Expand TOTEM bundle"}
        className="w-full flex items-start justify-between gap-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold tracking-tighter text-3xl leading-none text-ink">
            TOTEM
          </p>
          <p className="mt-2 tracking-tight text-ink text-base leading-none">
            Custom Modular Lamp
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-3xl tracking-tighter text-ink">
            {formatPrice(totalAmount.toFixed(2), currencyCode)}
          </span>
          <ChevronDown
            size={24}
            className={cn(
              "text-muted transition-transform duration-150",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded sub-rows */}
      {expanded && (
        <div className="mt-3">
          {lines.map((line) => {
            const { primary, secondary } = getLineLabel(line);
            return (
              <div
                key={line.id}
                className="flex items-center justify-between py-2 border-b border-stroke last:border-b-0"
              >
                <p className="text-xs text-muted">
                  {primary}
                  {secondary && ` · ${secondary}`}
                </p>
                <span className="text-xs text-muted ml-4 flex-shrink-0">
                  {formatPrice(
                    line.cost.totalAmount.amount,
                    line.cost.totalAmount.currencyCode,
                  )}
                </span>
              </div>
            );
          })}

          {/* Actions */}
          <div className="mt-2">
            {confirming ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted">Remove this bundle?</span>
                <button
                  type="button"
                  onClick={confirmRemove}
                  disabled={busy}
                  className="text-sm text-error underline-offset-2 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isRemoving ? "Removing…" : "Yes, remove"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  className="text-sm text-muted underline-offset-2 hover:underline disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <ArrowButton
                  type="button"
                  label="Remove bundle"
                  disabled={busy}
                  onClick={() => setConfirming(true)}
                  className="w-fit px-8 py-2.5 bg-white text-ink text-sm font-medium tracking-[-0.04em] border border-ink flex justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <ArrowButton
                  type="button"
                  label={isEditing ? "Loading…" : "Edit"}
                  disabled={busy}
                  onClick={handleEdit}
                  className="w-fit px-8 py-2.5 bg-white text-ink text-sm font-medium tracking-[-0.04em] border border-ink flex justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

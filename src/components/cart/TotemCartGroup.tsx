"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/common/Toast";
import { cn } from "@/lib/utils/cn";
import type { ShopifyCartLine } from "@/lib/shopify/types";
import { ArrowButton } from "@/components/ui/ArrowButton";

interface TotemCartGroupProps {
  lines: ShopifyCartLine[];
}

function getLineLabel(line: ShopifyCartLine): {
  primary: string;
  secondary?: string;
} {
  const part = line.attributes.find((a) => a.key === "Part")?.value;
  const productTitle = line.merchandise.product.title;
  const variantTitle = line.merchandise.title; // color name for shapes/fixations
  if (part === "Shape" || part === "Fixation") {
    return { primary: productTitle, secondary: variantTitle };
  }
  return { primary: productTitle };
}

export function TotemCartGroup({ lines }: TotemCartGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { removeItem } = useCart();
  const toast = useToast();

  const totalAmount = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "EUR";

  // Shape names for summary (max 3 + overflow count)
  const shapeNames = lines
    .filter(
      (l) => l.attributes.find((a) => a.key === "Part")?.value === "Shape",
    )
    .map((l) => `${l.merchandise.product.title} · ${l.merchandise.title}`);

  const LIMIT = 3;
  const overflow = shapeNames.length - LIMIT;
  const shapeSummary =
    overflow > 0
      ? `${shapeNames.slice(0, LIMIT).join(", ")} +${overflow} more`
      : shapeNames.join(", ");

  // Fixation + cable names for second summary line
  const fixationLine = lines.find(
    (l) => l.attributes.find((a) => a.key === "Part")?.value === "Fixation",
  );
  const cableLine = lines.find(
    (l) => l.attributes.find((a) => a.key === "Part")?.value === "Cable",
  );
  const fixationName = fixationLine
    ? `${fixationLine.merchandise.product.title} · ${fixationLine.merchandise.title}`
    : undefined;
  const cableName = cableLine?.merchandise.product.title;
  const systemSummary = [fixationName, cableName].filter(Boolean).join(" · ");

  async function removeBundle() {
    setIsRemoving(true);
    try {
      for (const line of lines) {
        await removeItem(line.id);
      }
    } catch {
      toast.error("Could not remove bundle. Please try again.");
    } finally {
      setIsRemoving(false);
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
          <p className="mt-2 tracking-tight text-ink text-base leading-none text-ink">
            Custom Modular Lamp
          </p>
          {shapeSummary && (
            <p className="text-xs text-muted mt-1 truncate">{shapeSummary}</p>
          )}
          {systemSummary && (
            <p className="text-xs text-muted truncate">{systemSummary}</p>
          )}
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
          <div className="mt-2">
            <ArrowButton
              type="button"
              label={isRemoving ? "Removing…" : "Remove bundle"}
              disabled={isRemoving}
              onClick={removeBundle}
              className="w-fit px-8 py-2.5 rounded-md bg-white text-ink text-sm font-medium tracking-[-0.04em] border border-ink flex justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      )}
    </div>
  );
}

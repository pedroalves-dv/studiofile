"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils/cn";
import type { ShopifyCartLine } from "@/lib/shopify/types";

interface TotemCartGroupProps {
  lines: ShopifyCartLine[];
}

function getLineLabel(line: ShopifyCartLine): {
  primary: string;
  secondary?: string;
} {
  const shapeName = line.attributes.find((a) => a.key === "Shape")?.value;
  const colorName = line.attributes.find((a) => a.key === "Color")?.value;
  const fixationName = line.attributes.find((a) => a.key === "Fixation")?.value;
  const cableName = line.attributes.find((a) => a.key === "Cable")?.value;
  if (shapeName) return { primary: shapeName, secondary: colorName };
  if (fixationName) return { primary: fixationName };
  if (cableName) return { primary: cableName };
  return { primary: line.merchandise.product.title };
}

export function TotemCartGroup({ lines }: TotemCartGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const { removeItem } = useCart();

  const totalAmount = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "EUR";

  // Shape names for summary (max 3 + overflow count)
  const shapeNames = lines
    .map((l) => l.attributes.find((a) => a.key === "Shape")?.value)
    .filter((v): v is string => Boolean(v));

  const LIMIT = 3;
  const overflow = shapeNames.length - LIMIT;
  const shapeSummary =
    overflow > 0
      ? `${shapeNames.slice(0, LIMIT).join(" · ")} +${overflow} more`
      : shapeNames.join(" · ");

  // Fixation + cable names for second summary line
  const fixationName = lines
    .flatMap((l) => l.attributes)
    .find((a) => a.key === "Fixation")?.value;
  const cableName = lines
    .flatMap((l) => l.attributes)
    .find((a) => a.key === "Cable")?.value;
  const systemSummary = [fixationName, cableName].filter(Boolean).join(" · ");

  async function removeBundle() {
    for (const line of lines) {
      await removeItem(line.id);
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
          {shapeSummary && (
            <p className="text-xs text-muted mt-1 truncate">{shapeSummary}</p>
          )}
          {systemSummary && (
            <p className="text-xs text-muted truncate">{systemSummary}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <span className="text-sm text-ink">
            {formatPrice(totalAmount.toFixed(2), currencyCode)}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "text-muted transition-transform duration-150",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded sub-rows */}
      {expanded && (
        <div className="mt-3 pl-4">
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
            <button
              type="button"
              onClick={removeBundle}
              className="text-xs text-muted hover:text-error transition-colors"
            >
              Remove bundle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

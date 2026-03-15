'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils/format';
import type { ShopifyCartLine } from '@/lib/shopify/types';

interface TotemCartGroupProps {
  lines: ShopifyCartLine[];
}

function getVisibleAttrs(line: ShopifyCartLine): string[] {
  return line.attributes.filter((a) => !a.key.startsWith('_')).map((a) => a.value);
}

export function TotemCartGroup({ lines }: TotemCartGroupProps) {
  const [expanded, setExpanded] = useState(false);

  // Sum total price across all lines in the group
  const totalAmount = lines.reduce((sum, line) => sum + parseFloat(line.cost.totalAmount.amount), 0);
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'EUR';

  // Build a summary string from visible attributes of the first few lines
  const pieceLabels = lines.flatMap((line) => getVisibleAttrs(line));
  const SUMMARY_LIMIT = 3;
  const summaryVisible = pieceLabels.slice(0, SUMMARY_LIMIT);
  const overflow = pieceLabels.length - SUMMARY_LIMIT;
  const summary = overflow > 0
    ? `${summaryVisible.join(' · ')} +${overflow} more`
    : summaryVisible.join(' · ');

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-display uppercase tracking-tight text-sm text-ink">TOTEM</p>
          {summary && (
            <p className="text-xs text-muted mt-0.5 truncate">{summary}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-mono text-xs">
            {formatPrice(totalAmount.toFixed(2), currencyCode)}
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse TOTEM bundle' : 'Expand TOTEM bundle'}
            className="text-muted hover:text-ink transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Expanded sub-rows */}
      {expanded && (
        <div className="mt-2 flex flex-col gap-1">
          {lines.map((line) => {
            const attrs = getVisibleAttrs(line);
            return (
              <div key={line.id} className="flex items-center justify-between py-1 border-t border-stroke">
                <p className="text-xs text-muted">{attrs.join(' · ') || line.merchandise.product.title}</p>
                <span className="font-mono text-xs text-muted flex-shrink-0 ml-4">
                  {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

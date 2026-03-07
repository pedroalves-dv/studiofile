'use client';

import { useState } from 'react';
import type { ShopifyProductVariant } from '@/lib/shopify/types';
import { cn } from '@/lib/utils/cn';

interface VariantSelectorProps {
  variants: ShopifyProductVariant[];
  selectedVariant: ShopifyProductVariant;
  onVariantChange: (variant: ShopifyProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    Object.fromEntries(selectedVariant.selectedOptions.map((o) => [o.name, o.value]))
  );

  // If single variant with default "Title" option, nothing to show
  if (
    variants.length === 1 &&
    variants[0].selectedOptions.length === 1 &&
    variants[0].selectedOptions[0].name === 'Title'
  ) {
    return null;
  }

  // Collect all unique option names
  const optionNames = Array.from(
    new Set(variants.flatMap((v) => v.selectedOptions.map((o) => o.name)))
  );

  const handleSelect = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const match = variants.find((v) =>
      v.selectedOptions.every((o) => newOptions[o.name] === o.value)
    );
    if (match) onVariantChange(match);
  };

  // Check whether a given option value is available given current selections for other options
  const isAvailable = (optionName: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: value };
    return variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.every((o) => testOptions[o.name] === o.value)
    );
  };

  return (
    <div className="space-y-6">
      {optionNames.map((optionName) => {
        const values = Array.from(
          new Set(
            variants
              .flatMap((v) => v.selectedOptions)
              .filter((o) => o.name === optionName)
              .map((o) => o.value)
          )
        );

        return (
          <div key={optionName}>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-label text-muted">{optionName}</span>
              <span className="text-label text-ink">{selectedOptions[optionName]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const selected = selectedOptions[optionName] === value;
                const available = isAvailable(optionName, value);

                return (
                  <button
                    key={value}
                    onClick={() => available && handleSelect(optionName, value)}
                    disabled={!available}
                    aria-label={`${optionName}: ${value}${!available ? ' (unavailable)' : ''}`}
                    aria-pressed={selected}
                    className={cn(
                      'px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-200',
                      selected
                        ? 'bg-ink text-canvas border-ink'
                        : 'bg-transparent text-ink border-border hover:border-ink',
                      !available && 'opacity-40 cursor-not-allowed line-through'
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

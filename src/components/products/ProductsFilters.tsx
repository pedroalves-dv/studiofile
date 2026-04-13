// src/components/products/ProductsFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPE_FILTERS = [
  { value: "Lighting", label: "Lighting" },
  { value: "Furniture", label: "Furniture" },
  { value: "Decor", label: "Décor" },
  { value: "Accessories", label: "Accessories" },
];

const AVAILABILITY_FILTERS = [
  { value: "in-stock", label: "In Stock" },
  { value: "on-sale", label: "On Sale" },
];

export function ProductsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("type");
  const activeAvail = searchParams.get("availability");

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("cursor");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const toggleAvailability = (value: string) => {
    setParam("availability", activeAvail === value ? null : value);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 max-w-full">
      {/* Type group */}
      <button
        onClick={() => setParam("type", null)}
        className={`shrink-0 px-3 py-1.5 text-sm border transition-colors ${
          !activeType
            ? "border-ink bg-ink text-canvas"
            : "border-stroke text-muted hover:border-ink hover:text-ink"
        }`}
      >
        All
      </button>

      {TYPE_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() =>
            setParam("type", activeType === f.value ? null : f.value)
          }
          className={`shrink-0 px-3 py-1.5 text-sm border transition-colors ${
            activeType === f.value
              ? "border-ink bg-ink text-canvas"
              : "border-stroke text-muted hover:border-ink hover:text-ink"
          }`}
        >
          {f.label}
        </button>
      ))}

      {/* Divider */}
      <span className="shrink-0 h-4 w-px bg-stroke mx-1" />

      {/* Availability group */}
      {AVAILABILITY_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => toggleAvailability(f.value)}
          className={`shrink-0 px-3 py-1.5 text-sm border transition-colors ${
            activeAvail === f.value
              ? "border-ink bg-ink text-canvas"
              : "border-stroke text-muted hover:border-ink hover:text-ink"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

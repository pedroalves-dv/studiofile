// src/components/products/ProductsFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TAG_FILTERS = [
  { value: "totem-shape", label: "Shapes" },
  { value: "totem-fixture", label: "Fixtures" },
  { value: "totem-cable", label: "Cables" },
];

const AVAILABILITY_FILTERS = [
  { value: "in-stock", label: "In Stock" },
  { value: "on-sale", label: "On Sale" },
];

export function ProductsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTag = searchParams.get("tag");
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
      {/* Tag group */}
      <button
        onClick={() => setParam("tag", null)}
        className={`shrink-0 px-4 py-2 text-base md:text-base border border-stroke rounded-full transition-colors ${
          !activeTag
            ? "border-ink bg-ink text-canvas"
            : "border-stroke bg-white text-muted hover:border-ink hover:text-ink"
        }`}
      >
        All
      </button>

      {TAG_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() =>
            setParam("tag", activeTag === f.value ? null : f.value)
          }
          className={`shrink-0 px-4 py-2 text-base md:text-base border border-stroke rounded-full transition-colors ${
            activeTag === f.value
              ? "border-ink bg-ink text-canvas"
              : "border-stroke bg-white text-muted hover:border-ink hover:text-ink"
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
          className={`shrink-0 px-4 py-2 text-base md:text-base border border-stroke rounded-full transition-colors ${
            activeAvail === f.value
              ? "border-ink bg-ink text-canvas"
              : "border-stroke bg-white text-muted hover:border-ink hover:text-ink"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

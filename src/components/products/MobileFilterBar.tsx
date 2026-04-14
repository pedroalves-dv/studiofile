// src/components/products/MobileFilterBar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ListFilter } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";

const TAG_FILTERS = [
  { label: "Shapes", value: "totem-shape" },
  { label: "Fixtures", value: "totem-fixture" },
  { label: "Cables", value: "totem-cable" },
];

const AVAIL_FILTERS = [
  { label: "In Stock", value: "in-stock" },
  { label: "On Sale", value: "on-sale" },
];

const SORT_OPTIONS = [
  { label: "Best Selling", value: "BEST_SELLING" },
  { label: "Price: Low to High", value: "PRICE_ASC" },
  { label: "Price: High to Low", value: "PRICE_DESC" },
  { label: "Newest", value: "CREATED" },
  { label: "Most Relevant", value: "RELEVANCE" },
];

export function MobileFilterBar() {
  const [openSheet, setOpenSheet] = useState<"filter" | "sort" | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTag = searchParams.get("tag");
  const activeAvail = searchParams.get("availability");
  const activeSort = searchParams.get("sort") || "BEST_SELLING";

  const isFilterActive = !!(activeTag || activeAvail);
  const isSortActive = activeSort !== "BEST_SELLING";

  const activeFilterCount = [activeTag, activeAvail].filter(Boolean).length;

  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString());
    if (value === null) p.delete(key);
    else p.set(key, value);
    p.delete("cursor");
    router.replace(`?${p.toString()}`, { scroll: false });
  }

  function clearAll() {
    const p = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) p.set("sort", sort);
    router.replace(`?${p.toString()}`, { scroll: false });
  }

  const pillBase =
    "flex items-center gap-2 rounded-full border px-8 py-2 text-base font-medium transition-colors";
  const pillActive = `${pillBase} border-ink bg-ink text-canvas`;
  const pillInactive = `${pillBase} border-stroke bg-canvas text-ink/60`;

  return (
    <>
      <div className="flex gap-2 md:hidden">
        {/* Filter pill */}
        <button
          className={isFilterActive ? pillActive : pillInactive}
          onClick={() => setOpenSheet("filter")}
        >
          <ListFilter size={14} aria-hidden="true" />
          Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>

        {/* Sort pill */}
        <button
          className={isSortActive ? pillActive : pillInactive}
          onClick={() => setOpenSheet("sort")}
        >
          <ArrowUpDown size={14} aria-hidden="true" />
          Sort
        </button>
      </div>

      {/* Sort sheet */}
      <BottomSheet
        title="Sort by"
        isOpen={openSheet === "sort"}
        onClose={() => setOpenSheet(null)}
      >
        <ul className="px-5 py-4 space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isActive = activeSort === opt.value;
            return (
              <li key={opt.value}>
                <button
                  className={`flex items-center justify-between w-full px-4 py-3.5 border rounded-lg text-left text-lg ${isActive ? "border-ink" : "border-stroke"}`}
                  onClick={() => {
                    setParam(
                      "sort",
                      opt.value === "BEST_SELLING" ? null : opt.value,
                    );
                    setOpenSheet(null);
                  }}
                >
                  <span className={isActive ? "text-ink" : "text-ink/40"}>
                    {opt.label}
                  </span>
                  {isActive && <Check size={20} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>

      {/* Filter sheet */}
      <BottomSheet
        title="Filter"
        isOpen={openSheet === "filter"}
        onClose={() => setOpenSheet(null)}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-site py-4 space-y-6">
            {/* Component group */}
            <section>
              <p className="text-base font-medium tracking-normal text-muted mb-3">
                Component
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={!activeTag ? pillActive : pillInactive}
                  onClick={() => setParam("tag", null)}
                >
                  All
                </button>
                {TAG_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    className={
                      activeTag === f.value ? pillActive : pillInactive
                    }
                    onClick={() =>
                      setParam("tag", activeTag === f.value ? null : f.value)
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Availability group */}
            <section>
              <p className="text-base font-medium tracking-normal text-muted mb-3">
                Availability
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAIL_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    className={
                      activeAvail === f.value ? pillActive : pillInactive
                    }
                    onClick={() =>
                      setParam(
                        "availability",
                        activeAvail === f.value ? null : f.value,
                      )
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky CTA bar */}
          <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-t border-stroke">
            <button
              className="flex-1 rounded-lg border border-stroke bg-canvas text-ink text-base font-medium py-3 hover:bg-ink/5 transition-colors"
              onClick={clearAll}
            >
              Clear all
            </button>
            <button
              className="flex-1 rounded-lg bg-ink text-canvas text-base font-medium py-3 hover:bg-ink/90 transition-colors"
              onClick={() => setOpenSheet(null)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

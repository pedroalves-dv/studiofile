"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const FILTER_GROUPS = [
  {
    id: "availability",
    label: "Availability",
    filters: [
      { value: "in-stock", label: "In Stock" },
      { value: "pre-order", label: "Pre-Order" },
    ],
  },
  {
    id: "type",
    label: "Product Type",
    filters: [
      { value: "furniture", label: "Furniture" },
      { value: "decor", label: "Décor" },
      { value: "lighting", label: "Lighting" },
      { value: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "tag",
    label: "Collections",
    filters: [
      { value: "outdoor", label: "Outdoor" },
      { value: "minimalist", label: "Minimalist" },
      { value: "geometric", label: "Geometric" },
    ],
  },
];

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Parse active filters from URL
  const filterParams = searchParams.getAll("filter");
  const activeFilters = new Set(filterParams);
  const activeCount = activeFilters.size;

  const handleToggleFilter = (filterType: string, filterValue: string) => {
    const filterKey = `${filterType}:${filterValue}`;
    const params = new URLSearchParams(searchParams);

    if (activeFilters.has(filterKey)) {
      params.delete("filter", filterKey);
      activeFilters.delete(filterKey);
    } else {
      params.append("filter", filterKey);
      activeFilters.add(filterKey);
    }

    // Reset pagination when filters change
    params.delete("cursor");
    router.replace(`?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    params.delete("cursor");
    router.replace(`?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden inline-flex items-center gap-2 px-4 py-2 border border-border bg-canvas text-ink text-sm hover:bg-stone-50 transition-colors"
      >
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-accent text-canvas rounded-full text-xs font-medium">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter panel */}
      <aside
        className={`
          fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto
          bg-canvas border-t md:border-t-0 md:border-r border-border
          w-full md:w-64 max-h-[80vh] md:max-h-none overflow-y-auto
          transform transition-transform duration-300 z-50
          md:translate-y-0
          ${isOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"}
        `}
      >
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6 md:mb-0">
            <h2 className="text-lg text-ink md:hidden">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-ink/60 hover:text-ink transition-colors"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filter groups */}
          <div className="space-y-8 md:space-y-6">
            {FILTER_GROUPS.map((group) => (
              <div key={group.id}>
                <h3 className="font-medium text-sm text-ink mb-3">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.filters.map((filter) => {
                    const filterKey = `${group.id}:${filter.value}`;
                    const isActive = activeFilters.has(filterKey);

                    return (
                      <label
                        key={filter.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() =>
                            handleToggleFilter(group.id, filter.value)
                          }
                          className="w-4 h-4 border border-border accent-accent cursor-pointer"
                        />
                        <span className="text-sm text-ink/70 group-hover:text-ink transition-colors">
                          {filter.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Clear all button */}
          {activeCount > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-8 md:mt-6 w-full text-center text-sm text-accent hover:text-accent/70 transition-colors"
            >
              Clear all filters
            </button>
          )}

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden mt-8 w-full py-3 bg-ink text-canvas font-medium hover:bg-ink/90 transition-colors"
          >
            Show results
          </button>
        </div>
      </aside>
    </>
  );
}

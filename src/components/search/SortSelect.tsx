// src/components/search/SortSelect.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CustomSelect } from "@/components/ui/CustomSelect";

// Search-specific sort options — includes RELEVANCE which is unique to the search API
const SORT_OPTIONS = [
  { value: "RELEVANCE", label: "Most Relevant" },
  { value: "BEST_SELLING", label: "Best Selling" },
  { value: "PRICE_ASC", label: "Price (Low to High)" },
  { value: "PRICE_DESC", label: "Price (High to Low)" },
  { value: "CREATED", label: "Newest" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "RELEVANCE";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "RELEVANCE") {
      params.delete("sort");
      params.delete("reverse");
    } else if (value === "PRICE_ASC") {
      params.set("sort", "PRICE_ASC");
      params.delete("reverse");
    } else if (value === "PRICE_DESC") {
      params.set("sort", "PRICE_DESC");
      params.delete("reverse");
    } else {
      params.set("sort", value);
      params.delete("reverse");
    }
    params.delete("cursor");
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="w-44">
      <CustomSelect
        id="search-sort"
        value={currentSort}
        onChange={handleChange}
        options={SORT_OPTIONS}
        rounded="full"
      />
    </div>
  );
}

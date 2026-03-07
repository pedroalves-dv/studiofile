'use client';

import { useRouter, useSearchParams } from 'next/navigation';

// Search-specific sort options — includes RELEVANCE which is unique to the search API
const SORT_OPTIONS = [
  { value: 'RELEVANCE', label: 'Most Relevant' },
  { value: 'BEST_SELLING', label: 'Best Selling' },
  { value: 'PRICE_ASC', label: 'Price (Low to High)' },
  { value: 'PRICE_DESC', label: 'Price (High to Low)' },
  { value: 'CREATED', label: 'Newest' },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'RELEVANCE';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'RELEVANCE') {
      params.delete('sort');
      params.delete('reverse');
    } else if (value === 'PRICE_ASC') {
      params.set('sort', 'PRICE_ASC');
      params.delete('reverse');
    } else if (value === 'PRICE_DESC') {
      params.set('sort', 'PRICE_DESC');
      params.delete('reverse');
    } else {
      params.set('sort', value);
      params.delete('reverse');
    }
    params.delete('cursor');
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="search-sort" className="text-label text-muted whitespace-nowrap">
        Sort by
      </label>
      <select
        id="search-sort"
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="px-3 py-2 border border-border bg-canvas text-ink text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer pr-8"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%238A8580\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

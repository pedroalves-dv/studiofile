'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'BEST_SELLING', label: 'Best Selling' },
  { value: 'TITLE', label: 'Title (A-Z)' },
  { value: 'PRICE_ASC', label: 'Price (Low to High)' },
  { value: 'PRICE_DESC', label: 'Price (High to Low)' },
  { value: 'CREATED', label: 'Newest' },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'BEST_SELLING';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === 'BEST_SELLING') {
      params.delete('sort');
      params.delete('reverse');
    } else if (value.startsWith('PRICE_')) {
      params.set('sort', 'PRICE');
      params.set('reverse', value === 'PRICE_DESC' ? 'true' : 'false');
    } else if (value === 'CREATED') {
      params.set('sort', 'CREATED');
      params.delete('reverse');
    } else {
      params.set('sort', value);
      params.delete('reverse');
    }
    
    // Reset to first page when sorting changes
    params.delete('cursor');
    
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm font-medium text-ink">
        Sort by
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="px-3 py-2 border border-border bg-canvas text-ink text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

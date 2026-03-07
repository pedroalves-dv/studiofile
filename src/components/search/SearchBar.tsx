'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader } from 'lucide-react';
import type { ShopifyPredictiveSearchResult } from '@/lib/shopify/types';
import { cn } from '@/lib/utils/cn';
import { PredictiveSearch } from './PredictiveSearch';

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ onClose, autoFocus = false, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyPredictiveSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const fetchPredictive = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search/predictive?q=${encodeURIComponent(q)}`);
      const data: ShopifyPredictiveSearchResult = await res.json();
      setResults(data);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch {
      // fail silently — search overlay shouldn't break the page
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictive(value), 300);
  };

  const navigateToSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setIsOpen(false);
      setQuery('');
      onClose?.();
    },
    [router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setQuery('');
        setResults(null);
        setIsOpen(false);
        inputRef.current?.blur();
        onClose?.();
        break;
      case 'Enter':
        e.preventDefault();
        navigateToSearch(query);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => i + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(-1, i - 1));
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className="flex items-center gap-3 border-b border-border focus-within:border-accent transition-colors">
        <Search size={18} className="flex-shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results) setIsOpen(true);
          }}
          placeholder="Search products…"
          autoFocus={autoFocus}
          autoComplete="off"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="flex-1 py-3 bg-transparent text-ink placeholder-muted focus:outline-none text-base"
        />
        {isLoading && (
          <Loader size={16} className="flex-shrink-0 text-muted animate-spin" aria-hidden="true" />
        )}
        {query && !isLoading && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="flex-shrink-0 p-1 text-muted hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results && (
        <PredictiveSearch
          query={query}
          results={results}
          isLoading={isLoading}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onSeeAll={() => navigateToSearch(query)}
        />
      )}
    </div>
  );
}

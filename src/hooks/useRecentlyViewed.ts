// Custom hook for recently viewed products
'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useRecentlyViewed() {
  const [products, setProducts] = useLocalStorage<string[]>('recentlyViewed', []);

  const addProduct = useCallback(
    (productHandle: string) => {
      setProducts((prev) => {
        const filtered = prev.filter((handle) => handle !== productHandle);
        return [productHandle, ...filtered].slice(0, 10);
      });
    },
    [setProducts]
  );

  const clear = useCallback(() => {
    setProducts([]);
  }, [setProducts]);

  return {
    products,
    addProduct,
    clear,
  };
}

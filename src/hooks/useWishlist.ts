// Custom hooks for wishlist management
'use client';

import { useCallback, useState } from 'react';

export function useWishlist() {
  const [items, setItems] = useState<string[]>([]);

  const addItem = useCallback((productId: string) => {
    setItems((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
  };
}

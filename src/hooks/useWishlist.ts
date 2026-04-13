'use client'

import { useContext } from 'react'
import { WishlistContext, type WishlistItem } from '@/context/WishlistContext'

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  const { state, dispatch, wishlistIconRef } = ctx

  return {
    items: state.items,
    isOpen: state.isOpen,
    totalCount: state.items.length,
    wishlistIconRef,

    isWishlisted: (handle: string) => state.items.some(i => i.handle === handle),

    addItem: (
      handle: string,
      variantId?: string,
      selectedOptions?: WishlistItem['selectedOptions'],
    ) => dispatch({ type: 'ADD', item: { handle, variantId, selectedOptions } }),

    removeItem: (handle: string) => dispatch({ type: 'REMOVE', handle }),

    toggleItem: (
      handle: string,
      variantId?: string,
      selectedOptions?: WishlistItem['selectedOptions'],
    ) => {
      const existing = state.items.find(i => i.handle === handle)
      if (!existing) {
        // Not in wishlist → add
        dispatch({ type: 'ADD', item: { handle, variantId, selectedOptions } })
      } else if (existing.variantId === variantId) {
        // Same state clicked again → remove
        dispatch({ type: 'REMOVE', handle })
      } else {
        // Different or new variant → upgrade existing entry
        dispatch({ type: 'ADD', item: { handle, variantId, selectedOptions } })
      }
    },

    clearWishlist: () => dispatch({ type: 'CLEAR' }),
    openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
  }
}

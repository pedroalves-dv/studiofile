'use client'

import { useContext } from 'react'
import { WishlistContext } from '@/context/WishlistContext'

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  const { state, dispatch, wishlistIconRef } = ctx

  return {
    items: state.items,
    isOpen: state.isOpen,
    totalCount: state.items.length,
    wishlistIconRef,

    isWishlisted: (handle: string) => state.items.includes(handle),

    addItem: (handle: string) => dispatch({ type: 'ADD', handle }),
    removeItem: (handle: string) => dispatch({ type: 'REMOVE', handle }),
    toggleItem: (handle: string) => dispatch({
      type: state.items.includes(handle) ? 'REMOVE' : 'ADD',
      handle,
    }),
    clearWishlist: () => dispatch({ type: 'CLEAR' }),
    openDrawer: () => dispatch({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => dispatch({ type: 'CLOSE_DRAWER' }),
  }
}

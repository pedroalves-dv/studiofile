'use client'

import { useEffect } from 'react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

export function ProductViewTracker({ handle }: { handle: string }) {
  const { addProduct } = useRecentlyViewed()
  useEffect(() => {
    addProduct(handle)
  }, [handle]) // runs once on mount per handle
  return null   // renders nothing
}

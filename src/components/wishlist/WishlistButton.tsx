'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useToast } from '@/components/common/Toast'

interface WishlistButtonProps {
  productHandle: string
  className?: string
}

export function WishlistButton({ productHandle, className = '' }: WishlistButtonProps) {
  const { isWishlisted, toggleItem } = useWishlist()
  const { success } = useToast()
  const [animate, setAnimate] = useState(false)
  const wishlisted = isWishlisted(productHandle)

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()    // prevent Link navigation if button is inside a card Link
    e.stopPropagation()
    toggleItem(productHandle)
    success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    setAnimate(true)
    setTimeout(() => setAnimate(false), 300)
  }

  return (
    <>
      <style>{`
        @keyframes wishlistPop {
          0% { transform: scale(1) }
          50% { transform: scale(1.3) }
          100% { transform: scale(1) }
        }
        .wishlist-pop { animation: wishlistPop 300ms ease-in-out; }
      `}</style>
      <button
        onClick={handleToggle}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`p-2 bg-canvas/80 hover:bg-canvas transition-colors ${animate ? 'wishlist-pop' : ''} ${className}`}
      >
        <Heart
          size={18}
          fill={wishlisted ? 'currentColor' : 'none'}
          className={wishlisted ? 'text-accent' : 'text-ink'}
        />
      </button>
    </>
  )
}

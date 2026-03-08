'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HorizontalScrollRowProps {
  children: ReactNode
  className?: string
}

export function HorizontalScrollRow({ children, className = '' }: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [])

  function scroll(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <div className={`relative ${className}`}>
      {/* Left arrow — desktop only, show only when canScrollLeft */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-canvas border border-border hover:border-ink transition-colors shadow-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {React.Children.map(children, child => (
          <div
            className="flex-none w-[calc(100%/1.5)] md:w-[calc(100%/3.5)]"
            style={{ scrollSnapAlign: 'start' }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-canvas border border-border hover:border-ink transition-colors shadow-sm"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  )
}

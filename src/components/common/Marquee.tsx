'use client'

import { cn } from '@/lib/utils/cn'

interface MarqueeProps {
  text: string
  speed?: number
  className?: string
  separator?: string
}

export function Marquee({ text, speed = 50, className, separator = ' · ' }: MarqueeProps) {
  const content = `${text}${separator}`.repeat(4)

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className="font-serif text-4xl flex whitespace-nowrap w-max animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  )
}

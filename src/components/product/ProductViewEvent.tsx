'use client'
import { useEffect } from 'react'
import { track } from '@vercel/analytics'

export function ProductViewEvent({ handle, title }: { handle: string; title: string }) {
  useEffect(() => {
    track('ProductView', { handle, title })
  }, [handle])
  return null
}

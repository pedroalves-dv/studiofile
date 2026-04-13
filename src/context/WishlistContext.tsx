'use client'

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'

export interface WishlistItem {
  handle: string
  variantId?: string
  selectedOptions?: Array<{ name: string; value: string }>
}

interface WishlistState {
  items: WishlistItem[]
  isOpen: boolean
}

type WishlistAction =
  | { type: 'LOAD'; items: WishlistItem[] }
  | { type: 'ADD'; item: WishlistItem }
  | { type: 'REMOVE'; handle: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }

interface WishlistContextValue {
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
  wishlistIconRef: React.RefObject<HTMLButtonElement>
}

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, items: action.items }
    case 'ADD':
      // Replace existing entry for the same handle — upgrades handle-only to variant-aware
      return {
        ...state,
        items: state.items.some(i => i.handle === action.item.handle)
          ? state.items.map(i => i.handle === action.item.handle ? action.item : i)
          : [...state.items, action.item],
      }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.handle !== action.handle) }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN_DRAWER':
      return { ...state, isOpen: true }
    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false })
  const wishlistIconRef = useRef<HTMLButtonElement>(null)

  // SSR guard on mount — migrate old string[] format gracefully
  useEffect(() => {
    const stored = localStorage.getItem('sf-wishlist')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const items: WishlistItem[] = parsed.map((i: unknown) =>
            typeof i === 'string' ? { handle: i } : i as WishlistItem
          )
          dispatch({ type: 'LOAD', items })
        }
      } catch {}
    }
  }, [])

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('sf-wishlist', JSON.stringify(state.items))
  }, [state.items])

  return (
    <WishlistContext.Provider value={{ state, dispatch, wishlistIconRef }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlistContext() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlistContext must be used inside WishlistProvider')
  return ctx
}

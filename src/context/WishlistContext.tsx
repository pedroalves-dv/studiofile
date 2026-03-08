'use client'

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'

interface WishlistState {
  items: string[]    // product handles
  isOpen: boolean
}

type WishlistAction =
  | { type: 'LOAD'; items: string[] }
  | { type: 'ADD'; handle: string }
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
      return state.items.includes(action.handle)
        ? state
        : { ...state, items: [...state.items, action.handle] }
    case 'REMOVE':
      return { ...state, items: state.items.filter(h => h !== action.handle) }
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

  // SSR guard on mount — localStorage does not exist server-side
  useEffect(() => {
    const stored = localStorage.getItem('sf-wishlist')
    if (stored) {
      try { dispatch({ type: 'LOAD', items: JSON.parse(stored) }) }
      catch {}
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

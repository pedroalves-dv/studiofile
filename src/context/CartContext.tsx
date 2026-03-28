'use client';

import { ReactNode, createContext, useContext, useReducer, useEffect, useRef, Dispatch } from 'react';
import type { ShopifyCart } from '@/lib/shopify/types';
import { getCart } from '@/lib/shopify/cart';

const CART_ID_KEY = 'sf-cart-id';

interface CartState {
  cartId: string | null;
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
}

export type CartAction =
  | { type: 'SET_CART'; cart: ShopifyCart }
  | { type: 'SET_CART_ID'; cartId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_LOADING'; loading: boolean };

interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  cartIconRef: React.RefObject<HTMLButtonElement | null>;
  /** Holds an in-flight createCart promise so concurrent first-adds share one cart. */
  pendingCartRef: React.MutableRefObject<Promise<ShopifyCart> | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.cart, cartId: action.cart.id };
    case 'SET_CART_ID':
      return { ...state, cartId: action.cartId };
    case 'CLEAR_CART':
      return { ...state, cart: null, cartId: null };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartId: null,
    cart: null,
    isOpen: false,
    isLoading: false,
  });

  const cartIconRef = useRef<HTMLButtonElement>(null);
  const pendingCartRef = useRef<Promise<ShopifyCart> | null>(null);

  // Load and validate stored cart on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (!stored) return;

    dispatch({ type: 'SET_LOADING', loading: true });
    getCart(stored)
      .then((cart) => {
        if (cart) {
          dispatch({ type: 'SET_CART', cart });
        } else {
          localStorage.removeItem(CART_ID_KEY);
          dispatch({ type: 'CLEAR_CART' });
        }
      })
      .catch(() => {
        localStorage.removeItem(CART_ID_KEY);
        dispatch({ type: 'CLEAR_CART' });
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', loading: false });
      });
  }, []);

  // Persist cartId to localStorage whenever it changes
  useEffect(() => {
    if (state.cartId) {
      localStorage.setItem(CART_ID_KEY, state.cartId);
    }
  }, [state.cartId]);

  return (
    <CartContext.Provider value={{ state, dispatch, cartIconRef, pendingCartRef }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}

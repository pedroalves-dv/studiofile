// Cart context and provider for managing Shopify cart state across the app, with localStorage persistence and hydration handling.
"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  Dispatch,
} from "react";
import type { ShopifyCart } from "@/lib/shopify/types";
import { getCart } from "@/lib/shopify/cart";

const CART_ID_KEY = "sf-cart-id";

interface CartState {
  cartId: string | null;
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
}

export type CartAction =
  | { type: "SET_CART"; cart: ShopifyCart }
  | { type: "SET_CART_ID"; cartId: string }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_LOADING"; loading: boolean };

interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  cartIconRef: React.RefObject<HTMLButtonElement | null>;
  /** Holds an in-flight createCart promise so concurrent first-adds share one cart. */
  pendingCartRef: React.MutableRefObject<Promise<ShopifyCart> | null>;
  /** Set to true by any user-initiated cart action before dispatching SET_CART.
   * Hydration effect checks this to avoid overwriting a more-recent user action. */
  hasUserActionRef: React.MutableRefObject<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.cart,
        cartId: action.cart.lines.length > 0 ? action.cart.id : null,
      };
    case "SET_CART_ID":
      return { ...state, cartId: action.cartId };
    case "CLEAR_CART":
      return { ...state, cart: null, cartId: null };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.loading };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Fix 1: Lazy initializer reads localStorage synchronously on first render,
  // so state.cartId is populated before any useEffect or user action runs.
  // This closes the hydration race window where addItem saw cartId=null and
  // created a duplicate cart instead of adding to the existing one.
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    (): CartState => ({
      cartId:
        typeof window !== "undefined"
          ? localStorage.getItem(CART_ID_KEY)
          : null,
      cart: null,
      isOpen: false,
      isLoading: false,
    }),
  );

  const cartIconRef = useRef<HTMLButtonElement>(null);
  const pendingCartRef = useRef<Promise<ShopifyCart> | null>(null);
  // Tracks whether the initial cart validation has completed.
  // Prevents the persistence effect from clearing localStorage during the first render
  // when state.cartId is still null (before getCart resolves).
  const hasHydrated = useRef(false);
  // Fix 2: Set to true by any user-initiated cart mutation before its SET_CART dispatch.
  // Hydration checks this so it doesn't overwrite a more-recent cart state.
  const hasUserActionRef = useRef(false);

  // Load and validate stored cart on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (!stored) {
      hasHydrated.current = true;
      return;
    }

    dispatch({ type: "SET_LOADING", loading: true });
    getCart(stored)
      .then((cart) => {
        // Fix 2: If a user action (addItem, etc.) already dispatched SET_CART
        // with fresher data, don't overwrite it with this stale hydration snapshot.
        if (hasUserActionRef.current) return;
        if (cart) {
          dispatch({ type: "SET_CART", cart });
        } else {
          // getCart returned null — cart expired on Shopify side, clear it.
          localStorage.removeItem(CART_ID_KEY);
          dispatch({ type: "CLEAR_CART" });
        }
      })
      .catch(() => {
        // Network error: keep localStorage intact so the next reload can retry.
        // Don't wipe the cart over a transient failure.
      })
      .finally(() => {
        hasHydrated.current = true;
        dispatch({ type: "SET_LOADING", loading: false });
      });
  }, []);

  // Persist cartId to localStorage whenever it changes.
  // Guard with hasHydrated so the initial null state doesn't delete a valid stored key.
  useEffect(() => {
    if (state.cartId) {
      localStorage.setItem(CART_ID_KEY, state.cartId.split("?")[0]); // ← clean before saving
    } else if (hasHydrated.current) {
      localStorage.removeItem(CART_ID_KEY);
    }
  }, [state.cartId]);

  return (
    <CartContext.Provider
      value={{ state, dispatch, cartIconRef, pendingCartRef, hasUserActionRef }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
}

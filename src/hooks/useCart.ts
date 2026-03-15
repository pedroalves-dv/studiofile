'use client';

import { track } from '@vercel/analytics';
import { useCartContext } from '@/context/CartContext';
import {
  createCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  applyDiscountCode,
  removeDiscountCode,
  updateCartNote,
} from '@/lib/shopify/cart';
import { useToast } from '@/components/common/Toast';
import type { MoneyV2, ShopifyCart } from '@/lib/shopify/types';
import {
  type TotemBuildConfig,
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
} from '@/lib/totem-config';

export function useCart() {
  const { state, dispatch, cartIconRef } = useCartContext();
  const toast = useToast();

  const { cart, isOpen, isLoading } = state;
  const totalQuantity = cart?.totalQuantity ?? 0;
  const totalAmount: MoneyV2 = cart?.cost.totalAmount ?? { amount: '0', currencyCode: 'USD' };

  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const addItem = async (variantId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      let updatedCart: ShopifyCart;
      if (state.cartId) {
        updatedCart = await addToCart(state.cartId, [{ merchandiseId: variantId, quantity }]);
      } else {
        updatedCart = await createCart([{ merchandiseId: variantId, quantity }]);
      }
      dispatch({ type: 'SET_CART', cart: updatedCart });
      openCart();
      toast.success('Added to cart');
      track('AddToCart', { productHandle: variantId, quantity });
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!state.cartId) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      let updatedCart: ShopifyCart;
      if (quantity === 0) {
        updatedCart = await removeFromCart(state.cartId, lineId);
      } else {
        updatedCart = await updateCartLine(state.cartId, lineId, quantity);
      }
      dispatch({ type: 'SET_CART', cart: updatedCart });
    } catch {
      toast.error('Failed to update cart.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const removeItem = async (lineId: string) => {
    if (!state.cartId) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const updatedCart = await removeFromCart(state.cartId, lineId);
      dispatch({ type: 'SET_CART', cart: updatedCart });
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const applyDiscount = async (code: string) => {
    if (!state.cartId) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const updatedCart = await applyDiscountCode(state.cartId, code);
      dispatch({ type: 'SET_CART', cart: updatedCart });
      const applied = updatedCart.discountCodes.find((d) => d.code === code);
      if (applied?.applicable) {
        toast.success(`Discount "${code}" applied!`);
      } else {
        toast.error(`Discount code "${code}" is not valid.`);
      }
    } catch {
      toast.error('Failed to apply discount code.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const removeDiscount = async () => {
    if (!state.cartId) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const updatedCart = await removeDiscountCode(state.cartId);
      dispatch({ type: 'SET_CART', cart: updatedCart });
      toast.success('Discount removed');
    } catch {
      toast.error('Failed to remove discount.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const updateNote = async (note: string) => {
    if (!state.cartId) return;
    try {
      const updatedCart = await updateCartNote(state.cartId, note);
      dispatch({ type: 'SET_CART', cart: updatedCart });
    } catch {
      // Fail silently for note updates
    }
  };

  const addBundle = async (config: TotemBuildConfig) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const buildId = 'build_' + Math.random().toString(36).slice(2, 10);
      // TODO: replace with per-shape variant IDs once Shopify products are created
      const variantId = process.env.NEXT_PUBLIC_TOTEM_VARIANT_ID ?? 'TOTEM_VARIANT_PLACEHOLDER';

      const lines = [
        // One line per piece
        ...config.pieces.map((piece) => {
          const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
          const color = TOTEM_COLORS.find((c) => c.id === piece.colorId);
          return {
            merchandiseId: variantId,
            quantity: 1,
            attributes: [
              { key: '_build_id', value: buildId },
              { key: 'Shape', value: shape?.name ?? piece.shapeId },
              { key: 'Color', value: color?.name ?? piece.colorId },
            ],
          };
        }),
        // Fixation line
        {
          merchandiseId: variantId,
          quantity: 1,
          attributes: [
            { key: '_build_id', value: buildId },
            { key: 'Fixation', value: TOTEM_FIXATIONS.find((f) => f.id === config.fixationId)?.name ?? config.fixationId },
          ],
        },
        // Cable line
        {
          merchandiseId: variantId,
          quantity: 1,
          attributes: [
            { key: '_build_id', value: buildId },
            { key: 'Cable', value: TOTEM_CABLES.find((c) => c.id === config.cableId)?.name ?? config.cableId },
          ],
        },
      ];

      let updatedCart: ShopifyCart;
      if (state.cartId) {
        updatedCart = await addToCart(state.cartId, lines);
      } else {
        updatedCart = await createCart(lines);
      }
      dispatch({ type: 'SET_CART', cart: updatedCart });
      toast.success('TOTEM added to cart');
      openCart();
      track('AddToCart', { productHandle: 'totem', pieces: config.pieces.length });
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  const isItemInCart = (variantId: string): boolean => {
    if (!cart) return false;
    return cart.lines.some((line) => line.merchandise.id === variantId);
  };

  const getItemQuantity = (variantId: string): number => {
    if (!cart) return 0;
    const line = cart.lines.find((line) => line.merchandise.id === variantId);
    return line?.quantity ?? 0;
  };

  return {
    cart,
    isOpen,
    isLoading,
    totalQuantity,
    totalAmount,
    cartIconRef,
    openCart,
    closeCart,
    addItem,
    addBundle,
    updateItem,
    removeItem,
    applyDiscount,
    removeDiscount,
    updateNote,
    isItemInCart,
    getItemQuantity,
  };
}

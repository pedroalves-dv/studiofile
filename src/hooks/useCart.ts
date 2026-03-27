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
import { generateUid } from '@/lib/utils/uid';
import {
  SHAPE_COLOR_VARIANT_MAP,
  FIXATION_VARIANT_MAP,
  CABLE_VARIANT_MAP,
} from '@/lib/totem-variant-map';
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  type TotemBuildConfig,
} from '@/lib/totem-config';
import type { MoneyV2, ShopifyCart } from '@/lib/shopify/types';

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

  const isItemInCart = (variantId: string): boolean => {
    if (!cart) return false;
    return cart.lines.some((line) => line.merchandise.id === variantId);
  };

  const getItemQuantity = (variantId: string): number => {
    if (!cart) return 0;
    const line = cart.lines.find((line) => line.merchandise.id === variantId);
    return line?.quantity ?? 0;
  };

  const addTotemToCart = async (config: TotemBuildConfig) => {
    const buildId = generateUid();

    const lines: Array<{ merchandiseId: string; quantity: number; attributes: Array<{ key: string; value: string }> }> = [];

    for (const piece of config.pieces) {
      const key = `${piece.shapeId}-${piece.colorId}`;
      const variantId = SHAPE_COLOR_VARIANT_MAP[key];
      if (!variantId || variantId === 'VARIANT_PLACEHOLDER') {
        toast.error('Some product variants are not yet available.');
        return;
      }
      const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
      const color = TOTEM_COLORS.find((c) => c.id === piece.colorId);
      lines.push({
        merchandiseId: variantId,
        quantity: 1,
        attributes: [
          { key: '_build_id', value: buildId },
          { key: '_build_label', value: `Custom Totem · ${shape?.name ?? piece.shapeId} — ${color?.name ?? piece.colorId}` },
          { key: 'Shape', value: shape?.name ?? piece.shapeId },
          { key: 'Color', value: color?.name ?? piece.colorId },
        ],
      });
    }

    const fixVariant = FIXATION_VARIANT_MAP[config.fixationId];
    if (!fixVariant || fixVariant === 'VARIANT_PLACEHOLDER') {
      toast.error('Some product variants are not yet available.');
      return;
    }
    const fixation = TOTEM_FIXATIONS.find((f) => f.id === config.fixationId);
    lines.push({
      merchandiseId: fixVariant,
      quantity: 1,
      attributes: [
        { key: '_build_id', value: buildId },
        { key: '_build_label', value: `Custom Totem · ${fixation?.name ?? config.fixationId} Fixation` },
        { key: 'Fixation', value: fixation?.name ?? config.fixationId },
      ],
    });

    const cableVariant = CABLE_VARIANT_MAP[config.cableId];
    if (!cableVariant || cableVariant === 'VARIANT_PLACEHOLDER') {
      toast.error('Some product variants are not yet available.');
      return;
    }
    const cable = TOTEM_CABLES.find((c) => c.id === config.cableId);
    lines.push({
      merchandiseId: cableVariant,
      quantity: 1,
      attributes: [
        { key: '_build_id', value: buildId },
        { key: '_build_label', value: `Custom Totem · ${cable?.name ?? config.cableId} Cable` },
        { key: 'Cable', value: cable?.name ?? config.cableId },
      ],
    });

    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      let updatedCart: ShopifyCart;
      if (state.cartId) {
        updatedCart = await addToCart(state.cartId, lines);
      } else {
        updatedCart = await createCart(lines);
      }
      dispatch({ type: 'SET_CART', cart: updatedCart });
      openCart();
      toast.success('Totem added to cart');
      track('AddTotemToCart', { pieces: config.pieces.length });
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
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
    updateItem,
    removeItem,
    applyDiscount,
    removeDiscount,
    updateNote,
    isItemInCart,
    getItemQuantity,
    addTotemToCart,
  };
}

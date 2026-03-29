"use client";

import { track } from "@vercel/analytics";
import { useCartContext } from "@/context/CartContext";
import {
  createCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  applyDiscountCode,
  removeDiscountCode,
  updateCartNote,
} from "@/lib/shopify/cart";
import { useToast } from "@/components/common/Toast";
import { generateUid } from "@/lib/utils/uid";
import {
  TOTEM_SHAPES,
  TOTEM_COLORS,
  TOTEM_FIXATIONS,
  TOTEM_CABLES,
  COLOR_MAP,
  type TotemBuildConfig,
} from "@/lib/totem-config";
import { CURRENCY_CODE } from "@/lib/constants";
import type { MoneyV2, ShopifyCart } from "@/lib/shopify/types";

export function useCart() {
  const { state, dispatch, cartIconRef, pendingCartRef } = useCartContext();
  const toast = useToast();

  /**
   * Creates a new cart or adds lines to an existing one.
   * Shares an in-flight createCart promise so simultaneous first-adds
   * don't create two separate carts.
   */
  async function createOrAdd(
    lines: Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>
  ): Promise<ShopifyCart> {
    if (state.cartId) return addToCart(state.cartId, lines);
    if (pendingCartRef.current) {
      const existingCart = await pendingCartRef.current;
      return addToCart(existingCart.id, lines);
    }
    const promise = createCart(lines);
    pendingCartRef.current = promise;
    try {
      return await promise;
    } finally {
      pendingCartRef.current = null;
    }
  }

  const { cart, isOpen, isLoading } = state;
  const totalQuantity = cart?.totalQuantity ?? 0;
  const totalAmount: MoneyV2 = cart?.cost.totalAmount ?? {
    amount: "0",
    currencyCode: CURRENCY_CODE,
  };

  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const addItem = async (variantId: string, quantity: number) => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const updatedCart = await createOrAdd([{ merchandiseId: variantId, quantity }]);
      dispatch({ type: "SET_CART", cart: updatedCart });
      openCart();
      toast.success("Added to cart");
      track("AddToCart", { productHandle: variantId, quantity });
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      let updatedCart: ShopifyCart;
      if (quantity === 0) {
        updatedCart = await removeFromCart(state.cartId, [lineId]);
      } else {
        updatedCart = await updateCartLine(state.cartId, lineId, quantity);
      }
      dispatch({ type: "SET_CART", cart: updatedCart });
    } catch {
      toast.error("Failed to update cart.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const removeItem = async (lineId: string) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const updatedCart = await removeFromCart(state.cartId, [lineId]);
      dispatch({ type: "SET_CART", cart: updatedCart });
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const removeBundleItems = async (lineIds: string[]) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const updatedCart = await removeFromCart(state.cartId, lineIds);
      dispatch({ type: "SET_CART", cart: updatedCart });
      toast.success("Bundle removed");
    } catch (err) {
      toast.error("Could not remove bundle. Please try again.");
      throw err;
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const applyDiscount = async (code: string) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const updatedCart = await applyDiscountCode(state.cartId, code);
      dispatch({ type: "SET_CART", cart: updatedCart });
      const applied = updatedCart.discountCodes.find((d) => d.code === code);
      if (applied?.applicable) {
        toast.success(`Discount "${code}" applied!`);
      } else {
        toast.error(`Discount code "${code}" is not valid.`);
      }
    } catch {
      toast.error("Failed to apply discount code.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const removeDiscount = async () => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const updatedCart = await removeDiscountCode(state.cartId);
      dispatch({ type: "SET_CART", cart: updatedCart });
      toast.success("Discount removed");
    } catch {
      toast.error("Failed to remove discount.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const updateNote = async (note: string) => {
    if (!state.cartId) return;
    try {
      const updatedCart = await updateCartNote(state.cartId, note);
      dispatch({ type: "SET_CART", cart: updatedCart });
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
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      // Fetch variant maps dynamically from Shopify (server-side cached, 1h revalidation)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      let shapes: Record<string, { id: string; available: boolean }>;
      let cables: Record<string, { id: string; available: boolean }>;
      try {
        const res = await fetch("/api/totem-variants", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("fetch failed");
        ({ shapes, cables } = (await res.json()) as {
          shapes: Record<string, { id: string; available: boolean }>;
          cables: Record<string, { id: string; available: boolean }>;
        });
      } catch {
        clearTimeout(timeoutId);
        toast.error("Unable to load product variants. Please try again.");
        return;
      }

      const buildId = generateUid();

      const lines: Array<{
        merchandiseId: string;
        quantity: number;
        attributes: Array<{ key: string; value: string }>;
      }> = [];

      for (const piece of config.pieces) {
        const key = `${piece.shapeId}-${piece.colorId}`;
        const variant = shapes[key];
        if (!variant?.id || !variant.available) {
          toast.error("One or more selected colors is out of stock.");
          return;
        }
        const shape = TOTEM_SHAPES.find((s) => s.id === piece.shapeId);
        const color = TOTEM_COLORS.find((c) => c.id === piece.colorId);
        lines.push({
          merchandiseId: variant.id,
          quantity: 1,
          attributes: [
            { key: "_build_id", value: buildId },
            {
              key: "_build_label",
              value: `Custom Totem · ${shape?.name ?? piece.shapeId} — ${color?.name ?? piece.colorId}`,
            },
            { key: "Part", value: "Shape" },
            { key: "_shape_id", value: piece.shapeId },
            { key: "_color_id", value: piece.colorId },
            { key: "_flipped", value: String(piece.flipped) },
          ],
        });
      }

      const fixationKey = `${config.fixationId}-${config.fixationColorId}`;
      const fixationVariant = shapes[fixationKey];
      if (!fixationVariant?.id || !fixationVariant.available) {
        toast.error("The selected fixation color is out of stock.");
        return;
      }
      const fixation = TOTEM_FIXATIONS.find((f) => f.id === config.fixationId);
      const fixationColorName =
        COLOR_MAP.get(config.fixationColorId)?.name ?? config.fixationColorId;
      lines.push({
        merchandiseId: fixationVariant.id,
        quantity: 1,
        attributes: [
          { key: "_build_id", value: buildId },
          {
            key: "_build_label",
            value: `Custom Totem · ${fixation?.name ?? config.fixationId} — ${fixationColorName}`,
          },
          { key: "Part", value: "Fixation" },
          { key: "_fixation_id", value: config.fixationId },
          { key: "_fixation_color_id", value: config.fixationColorId },
          // Full pieces snapshot — lets handleEdit reconstruct order + counts exactly,
          // regardless of how Shopify consolidates duplicate shape lines.
          {
            key: "_pieces_config",
            value: JSON.stringify(
              config.pieces.map((p) => ({
                shapeId: p.shapeId,
                colorId: p.colorId,
                flipped: p.flipped,
              })),
            ),
          },
        ],
      });

      const cableVariant = cables[config.cableId];
      if (!cableVariant?.id || !cableVariant.available) {
        toast.error("The selected cable is out of stock.");
        return;
      }
      const cable = TOTEM_CABLES.find((c) => c.id === config.cableId);
      lines.push({
        merchandiseId: cableVariant.id,
        quantity: 1,
        attributes: [
          { key: "_build_id", value: buildId },
          {
            key: "_build_label",
            value: `Custom Totem · ${cable?.name ?? config.cableId} Cable`,
          },
          { key: "Part", value: "Cable" },
          { key: "_cable_id", value: config.cableId },
        ],
      });

      const updatedCart = await createOrAdd(lines);
      dispatch({ type: "SET_CART", cart: updatedCart });
      openCart();
      toast.success("Totem added to cart");
      track("AddTotemToCart", { pieces: config.pieces.length });
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
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
    removeBundleItems,
    applyDiscount,
    removeDiscount,
    updateNote,
    isItemInCart,
    getItemQuantity,
    addTotemToCart,
  };
}

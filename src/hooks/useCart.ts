// src/hooks/useCart.ts
"use client";

import { track } from "@vercel/analytics";
import { useCartContext } from "@/context/CartContext";
import {
  createCart,
  addToCart,
  updateCartLine,
  updateCartLines,
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
  TOTEM_FIXTURES,
  TOTEM_CABLES,
  COLOR_MAP,
  type TotemBuildConfig,
} from "@/lib/totem-config";
import { CURRENCY_CODE } from "@/lib/constants";
import type { MoneyV2, ShopifyCart, ShopifyCartLine } from "@/lib/shopify/types";

export function useCart() {
  const { state, dispatch, cartIconRef, pendingCartRef, hasUserActionRef } =
    useCartContext();
  const toast = useToast();

  async function createOrAdd(
    lines: Array<{
      merchandiseId: string;
      quantity: number;
      attributes?: Array<{ key: string; value: string }>;
    }>,
  ): Promise<ShopifyCart> {
    try {
      let result;

      if (state.cartId) {
        result = await addToCart(state.cartId, lines);
      } else if (pendingCartRef.current) {
        const pendingResult = await pendingCartRef.current;
        if (pendingResult.error) throw new Error(pendingResult.error);
        result = await addToCart(pendingResult.cart.id, lines);
      } else {
        const promise = createCart(lines);
        pendingCartRef.current = promise;
        result = await promise;
      }

      if (result.error) {
        if (result.error.toLowerCase().includes("does not exist")) {
          console.warn("Cart expired or invalid. Creating fresh cart...");
          dispatch({ type: "CLEAR_CART" });
          localStorage.removeItem("sf-cart-id");
          const fresh = await createCart(lines);
          if (fresh.error) throw new Error(fresh.error);
          return fresh.cart;
        }
        throw new Error(result.error);
      }

      return result.cart;
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
      const existingLine = cart?.lines.find((line) => {
        const isSameVariant = line.merchandise.id === variantId;
        const isNotBundle = !line.attributes.some((a) => a.key === "_build_id");
        return isSameVariant && isNotBundle;
      });

      hasUserActionRef.current = true;
      let updatedCart: ShopifyCart;

      if (existingLine && state.cartId) {
        const result = await updateCartLine(
          state.cartId,
          existingLine.id,
          existingLine.quantity + quantity,
        );
        if (result.error) {
          if (result.error.toLowerCase().includes("does not exist")) {
            // Cart expired mid-session — clear stale state and add as a fresh cart
            dispatch({ type: "CLEAR_CART" });
            localStorage.removeItem("sf-cart-id");
            updatedCart = await createOrAdd([{ merchandiseId: variantId, quantity }]);
          } else {
            throw new Error(result.error);
          }
        } else {
          updatedCart = result.cart;
        }
      } else {
        updatedCart = await createOrAdd([{ merchandiseId: variantId, quantity }]);
      }

      dispatch({ type: "SET_CART", cart: updatedCart });
      openCart();
      toast.success("Added to cart");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      toast.error(message || "Failed to add to cart.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      hasUserActionRef.current = true;
      const result =
        quantity === 0
          ? await removeFromCart(state.cartId, [lineId])
          : await updateCartLine(state.cartId, lineId, quantity);
      if (result.error) {
        if (result.error.toLowerCase().includes("does not exist")) {
          dispatch({ type: "CLEAR_CART" });
          localStorage.removeItem("sf-cart-id");
          toast.error("Your cart expired. Please add your items again.");
        } else {
          toast.error(result.error);
        }
        return;
      }
      dispatch({ type: "SET_CART", cart: result.cart });
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
      hasUserActionRef.current = true;
      const result = await removeFromCart(state.cartId, [lineId]);
      if (result.error) {
        if (result.error.toLowerCase().includes("does not exist")) {
          dispatch({ type: "CLEAR_CART" });
          localStorage.removeItem("sf-cart-id");
          toast.error("Your cart expired. Please add your items again.");
        } else {
          toast.error(result.error);
        }
        return;
      }
      dispatch({ type: "SET_CART", cart: result.cart });
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const updateBundleQuantity = async (
    bundleLines: ShopifyCartLine[],
    currentBundleQty: number,
    newBundleQty: number,
  ) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      hasUserActionRef.current = true;
      const updates = bundleLines.map((line) => ({
        id: line.id,
        quantity: Math.round((line.quantity / currentBundleQty) * newBundleQty),
      }));
      const result = await updateCartLines(state.cartId, updates);
      if (result.error) {
        if (result.error.toLowerCase().includes("does not exist")) {
          dispatch({ type: "CLEAR_CART" });
          localStorage.removeItem("sf-cart-id");
          toast.error("Your cart expired. Please add your items again.");
        } else {
          toast.error(result.error);
        }
        return;
      }
      dispatch({ type: "SET_CART", cart: result.cart });
    } catch {
      toast.error("Failed to update bundle quantity.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const removeBundleItems = async (lineIds: string[]) => {
    if (!state.cartId) return;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      hasUserActionRef.current = true;
      const result = await removeFromCart(state.cartId, lineIds);
      if (result.error) {
        if (result.error.toLowerCase().includes("does not exist")) {
          dispatch({ type: "CLEAR_CART" });
          localStorage.removeItem("sf-cart-id");
          toast.error("Your cart expired. Please add your items again.");
        } else {
          toast.error(result.error);
        }
        return;
      }
      dispatch({ type: "SET_CART", cart: result.cart });
      toast.success("Bundle removed");
    } catch {
      toast.error("Could not remove bundle. Please try again.");
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const applyDiscount = async (code: string): Promise<boolean> => {
    if (!state.cartId) return false;
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const updatedCart = await applyDiscountCode(state.cartId, code);
      dispatch({ type: "SET_CART", cart: updatedCart });
      const applied = updatedCart.discountCodes.find((d) => d.code === code);
      if (applied?.applicable) {
        toast.success(`Discount "${code}" applied!`);
        return true;
      } else {
        toast.error(`Discount code "${code}" is not valid.`);
        return false;
      }
    } catch {
      toast.error("Failed to apply discount code.");
      return false;
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
      toast.error("Failed to save note.");
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
        const textureId = piece.textureId ?? "smooth";
        const key = `${piece.shapeId}-${piece.colorId}-${textureId}`;
        const variant = shapes[key];
        if (!variant?.id || !variant.available) {
          toast.error("One or more selected options is out of stock.");
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
            { key: "_part", value: "Shape" },
            { key: "_shape_id", value: piece.shapeId },
            { key: "_color_id", value: piece.colorId },
            { key: "_texture_id", value: textureId },
            { key: "_flipped", value: String(piece.flipped) },
          ],
        });
      }

      const fixtureTextureId = config.fixtureTextureId ?? "smooth";
      const fixtureKey = `${config.fixtureId}-${config.fixtureColorId}-${fixtureTextureId}`;
      const fixtureVariant = shapes[fixtureKey];
      if (!fixtureVariant?.id || !fixtureVariant.available) {
        toast.error("The selected fixture color is out of stock.");
        return;
      }
      const fixture = TOTEM_FIXTURES.find((f) => f.id === config.fixtureId);
      const fixtureColorName =
        COLOR_MAP.get(config.fixtureColorId)?.name ?? config.fixtureColorId;
      lines.push({
        merchandiseId: fixtureVariant.id,
        quantity: 1,
        attributes: [
          { key: "_build_id", value: buildId },
          {
            key: "_build_label",
            value: `Custom Totem · ${fixture?.name ?? config.fixtureId} — ${fixtureColorName}`,
          },
          { key: "_part", value: "Fixture" },
          { key: "_fixture_id", value: config.fixtureId },
          { key: "_fixture_color_id", value: config.fixtureColorId },
          { key: "_fixture_texture_id", value: fixtureTextureId },
          // Full pieces snapshot — lets handleEdit reconstruct order + counts exactly,
          // regardless of how Shopify consolidates duplicate shape lines.
          {
            key: "_pieces_config",
            value: JSON.stringify(
              config.pieces.map((p) => ({
                shapeId: p.shapeId,
                colorId: p.colorId,
                textureId: p.textureId ?? "smooth",
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
          { key: "_part", value: "Cable" },
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
    updateBundleQuantity,
    removeBundleItems,
    applyDiscount,
    removeDiscount,
    updateNote,
    isItemInCart,
    getItemQuantity,
    addTotemToCart,
  };
}

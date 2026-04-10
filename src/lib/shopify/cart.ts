// Shopify cart management with server actions for cart mutations and client-side hooks for cart state management.
"use server";

import { storefront } from "./client";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  CART_DISCOUNT_CODES_UPDATE,
  CART_NOTE_UPDATE,
} from "./mutations";
import { GET_CART } from "./queries";
import type { ShopifyCart, ShopifyCartLine } from "./types";

// --- HELPERS ---

interface RawCart extends Omit<ShopifyCart, "lines"> {
  lines: { edges: Array<{ node: ShopifyCartLine }> };
}

function normalizeCart(raw: RawCart): ShopifyCart {
  return {
    ...raw,
    lines: raw.lines.edges.map((e) => e.node),
  };
}

// --- TYPES ---

interface CreateCartResponse {
  cartCreate: {
    cart: RawCart;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}
interface CartResponse {
  cartLinesAdd: {
    cart: RawCart;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}
interface CartLineUpdateResponse {
  cartLinesUpdate: {
    cart: RawCart;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}
interface CartRemoveResponse {
  cartLinesRemove: {
    cart: RawCart;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}
interface DiscountCodesResponse {
  cartDiscountCodesUpdate: {
    cart: RawCart;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}
interface NoteUpdateResponse {
  cartNoteUpdate: {
    cart: RawCart;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}
interface CartFetchResponse {
  cart: RawCart | null;
}
interface CartLine {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{ key: string; value: string }>;
}

// --- EXPORTED ACTIONS ---

export async function createCart(lines?: CartLine[]): Promise<ShopifyCart> {
  const input = { lines: lines || [] };
  const response = await storefront<CreateCartResponse>(
    CART_CREATE,
    { input },
    { cache: "no-store" },
  );
  console.log("CREATED CART ID:", response.cartCreate.cart.id);
  console.log(
    "CREATED CART userErrors:",
    JSON.stringify(response.cartCreate.userErrors),
  ); // ← add this
  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors[0].message);
  }
  return normalizeCart(response.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: CartLine[],
): Promise<ShopifyCart> {
  const response = await storefront<CartResponse>(
    CART_LINES_ADD,
    {
      cartId,
      lines,
    },
    { cache: "no-store" },
  );
  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors[0].message);
  }
  return normalizeCart(response.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const response = await storefront<CartLineUpdateResponse>(
    CART_LINES_UPDATE,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    { cache: "no-store" },
  );
  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.cartLinesUpdate.userErrors[0].message);
  }
  return normalizeCart(response.cartLinesUpdate.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<ShopifyCart> {
  console.log("ATTEMPTING REMOVE ON ID:", cartId);
  const response = await storefront<CartRemoveResponse>(
    CART_LINES_REMOVE,
    {
      cartId,
      lineIds,
    },
    { cache: "no-store" },
  );
  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.cartLinesRemove.userErrors[0].message);
  }
  return normalizeCart(response.cartLinesRemove.cart);
}

export async function applyDiscountCode(
  cartId: string,
  code: string,
): Promise<ShopifyCart> {
  const response = await storefront<DiscountCodesResponse>(
    CART_DISCOUNT_CODES_UPDATE,
    {
      cartId, // PROTECTED: No cleanId here
      discountCodes: [code],
    },
    { cache: "no-store" },
  );
  if (response.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(response.cartDiscountCodesUpdate.userErrors[0].message);
  }
  return normalizeCart(response.cartDiscountCodesUpdate.cart);
}

export async function removeDiscountCode(cartId: string): Promise<ShopifyCart> {
  const response = await storefront<DiscountCodesResponse>(
    CART_DISCOUNT_CODES_UPDATE,
    {
      cartId, // PROTECTED: No cleanId here
      discountCodes: [],
    },
    { cache: "no-store" },
  );
  if (response.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(response.cartDiscountCodesUpdate.userErrors[0].message);
  }
  return normalizeCart(response.cartDiscountCodesUpdate.cart);
}

export async function updateCartNote(
  cartId: string,
  note: string,
): Promise<ShopifyCart> {
  const response = await storefront<NoteUpdateResponse>(
    CART_NOTE_UPDATE,
    {
      cartId, // PROTECTED: No cleanId here
      note,
    },
    { cache: "no-store" },
  );
  if (response.cartNoteUpdate.userErrors.length > 0) {
    throw new Error(response.cartNoteUpdate.userErrors[0].message);
  }
  return normalizeCart(response.cartNoteUpdate.cart);
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const response = await storefront<CartFetchResponse>(
    GET_CART,
    { cartId }, // PROTECTED: No cleanId here
    { cache: "no-store" },
  );
  return response.cart ? normalizeCart(response.cart) : null;
}

'use server';

// Cart-specific Shopify API Server Actions
import { storefront } from './client';
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  CART_DISCOUNT_CODES_UPDATE,
  CART_NOTE_UPDATE,
} from './mutations';
import { GET_CART } from './queries';
import type { ShopifyCart, ShopifyCartLine } from './types';

// Shopify returns lines as a GraphQL connection; normalize to a flat array
interface RawCart extends Omit<ShopifyCart, 'lines'> {
  lines: { edges: Array<{ node: ShopifyCartLine }> };
}

function normalizeCart(raw: RawCart): ShopifyCart {
  return {
    ...raw,
    lines: raw.lines.edges.map((e) => e.node),
  };
}

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

/**
 * Create a new cart
 */
export async function createCart(lines?: CartLine[]): Promise<ShopifyCart> {
  const input = {
    lines: lines || [],
  };

  const response = await storefront<CreateCartResponse>(CART_CREATE, { input });

  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors[0].message);
  }

  return normalizeCart(response.cartCreate.cart);
}

/**
 * Add items to cart
 */
export async function addToCart(
  cartId: string,
  lines: CartLine[]
): Promise<ShopifyCart> {
  const response = await storefront<CartResponse>(CART_LINES_ADD, {
    cartId,
    lines,
  });

  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors[0].message);
  }

  return normalizeCart(response.cartLinesAdd.cart);
}

/**
 * Update cart line quantity
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const response = await storefront<CartLineUpdateResponse>(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.cartLinesUpdate.userErrors[0].message);
  }

  return normalizeCart(response.cartLinesUpdate.cart);
}

/**
 * Remove cart line
 */
export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const response = await storefront<CartRemoveResponse>(CART_LINES_REMOVE, {
    cartId,
    lineIds: [lineId],
  });

  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.cartLinesRemove.userErrors[0].message);
  }

  return normalizeCart(response.cartLinesRemove.cart);
}

/**
 * Apply or remove discount codes
 */
export async function applyDiscountCode(
  cartId: string,
  code: string
): Promise<ShopifyCart> {
  const response = await storefront<DiscountCodesResponse>(
    CART_DISCOUNT_CODES_UPDATE,
    {
      cartId,
      discountCodes: [code],
    }
  );

  if (response.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(response.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return normalizeCart(response.cartDiscountCodesUpdate.cart);
}

/**
 * Remove all discount codes
 */
export async function removeDiscountCode(cartId: string): Promise<ShopifyCart> {
  const response = await storefront<DiscountCodesResponse>(
    CART_DISCOUNT_CODES_UPDATE,
    {
      cartId,
      discountCodes: [],
    }
  );

  if (response.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(response.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return normalizeCart(response.cartDiscountCodesUpdate.cart);
}

/**
 * Update cart note
 */
export async function updateCartNote(cartId: string, note: string): Promise<ShopifyCart> {
  const response = await storefront<NoteUpdateResponse>(CART_NOTE_UPDATE, {
    cartId,
    note,
  });

  if (response.cartNoteUpdate.userErrors.length > 0) {
    throw new Error(response.cartNoteUpdate.userErrors[0].message);
  }

  return normalizeCart(response.cartNoteUpdate.cart);
}

/**
 * Fetch cart by ID
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const response = await storefront<CartFetchResponse>(GET_CART, { cartId }, { cache: 'no-store' });

  return response.cart ? normalizeCart(response.cart) : null;
}

/**
 * Shopify Admin REST API client.
 * For operations requiring elevated permissions not available via the Storefront API.
 *
 * IMPORTANT: Only call from API routes or Server Actions — never from client components.
 * The Admin token must never be exposed to the browser.
 */

const ADMIN_BASE = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01`;

function adminFetch(path: string, options: RequestInit): Promise<Response> {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!token) throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN is not set");

  return fetch(`${ADMIN_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
      ...options.headers,
    },
  });
}

export interface DraftOrderLineItem {
  /** Numeric Shopify variant ID (not GID — strip the "gid://shopify/ProductVariant/" prefix) */
  variant_id: number;
  quantity: number;
  properties?: { name: string; value: string }[];
}

export interface CreateDraftOrderInput {
  line_items: DraftOrderLineItem[];
  /** Order-level note visible in Shopify Admin fulfillment view */
  note?: string;
}

/**
 * Creates a Shopify draft order and returns the hosted invoice URL.
 * The customer is redirected to this URL to complete checkout natively.
 * Draft order invoice URLs expire after 72 hours.
 */
export async function createDraftOrder(
  input: CreateDraftOrderInput
): Promise<{ invoiceUrl: string; draftOrderId: number }> {
  const res = await adminFetch("/draft_orders.json", {
    method: "POST",
    body: JSON.stringify({ draft_order: input }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shopify Admin API ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    draft_order: { id: number; invoice_url: string };
  };

  return {
    invoiceUrl: data.draft_order.invoice_url,
    draftOrderId: data.draft_order.id,
  };
}

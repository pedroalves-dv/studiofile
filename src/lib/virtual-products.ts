/**
 * Virtual products are locally defined — no Shopify product entry required.
 * Used to surface configurator-based products in product listings alongside
 * real Shopify products.
 */

export interface VirtualProduct {
  handle: string;
  title: string;
  description: string;
  href: string;
  /** Cover image for product cards and listing grids */
  image: { url: string; altText: string };
  /** Display price string shown in listings, e.g. "From €72" */
  priceLabel: string;
}

export const VIRTUAL_PRODUCTS: VirtualProduct[] = [
  {
    handle: "totem",
    title: "Totem",
    description:
      "Build your modular lamp. Choose shapes, colors, cable, and fixture. Made to order in Paris.",
    href: "/products/totem",
    image: {
      url: "/images/totem-cover.jpg",
      altText: "Totem — modular lamp by Studiofile",
    },
    priceLabel: "From €72",
  },
];

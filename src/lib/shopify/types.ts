// TypeScript types for Shopify API responses

// Price/Money types
export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPrice extends MoneyV2 {}

// Image type
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

// Product variant
export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;  // null = inventory tracking disabled = treat as unlimited
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  image: ShopifyImage | null;
}

// Product
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2 | null;
    maxVariantPrice: MoneyV2 | null;
  };
  variants: ShopifyProductVariant[];
  tags: string[];
  productType: string;
  availableForSale: boolean;
  totalInventory: number;
  vendor: string;
}

// Collection
export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: ShopifyImage | null;
  products: ShopifyProduct[];
  seo: {
    title: string | null;
    description: string | null;
  };
}

// Cart
export interface ShopifyCartMerchandise {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;  // null = inventory tracking disabled
  selectedOptions: Array<{ name: string; value: string }>;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  image: ShopifyImage | null;
  product: { title: string; handle: string };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyCartMerchandise;
  cost: {
    totalAmount: MoneyV2;
    subtotalAmount: MoneyV2;
  };
  discountAllocations: Array<{
    allocatedAmount: MoneyV2;
  }>;
  attributes: Array<{ key: string; value: string }>;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount: MoneyV2;
    totalDiscountAmount: MoneyV2;
  };
  lines: ShopifyCartLine[];
  discountCodes: Array<{
    code: string;
    applicable: boolean;
  }>;
  note: string | null;
}

// Customer
export interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string | null;
  country: string;
  zip: string | null;
  phone?: string | null;
}

export interface LocalizationCountry {
  isoCode: string;
  name: string;
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  orders: {
    edges: Array<{ node: ShopifyOrder }>;
  };
  defaultAddress: ShopifyAddress | null;
  addresses: {
    edges: Array<{ node: ShopifyAddress }>;
  };
}

// Order
export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  name: string;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  statusUrl: string;
  currentTotalPrice: MoneyV2;
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        originalTotalPrice: MoneyV2;
      };
    }>;
  };
}

// Policy
export interface ShopifyPolicy {
  id: string;
  handle: string;
  title: string;
  body: string;
  url: string;
}

// Shop
export interface ShopifyShop {
  name: string;
  primaryDomain: {
    url: string;
  };
  shipsToCountries: string[];
}

// Search
export interface ShopifyPredictiveSearchResult {
  products: ShopifyProduct[];
  collections: ShopifyCollection[];
  queries: Array<{
    text: string;
    storeId: string;
  }>;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ShopifySearchResult {
  products: ShopifyProduct[];
  totalCount: number;
  pageInfo: ShopifyPageInfo;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
}

// Custom error type
export class ShopifyError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Array<{ message: string; extensions?: Record<string, unknown> }>
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}

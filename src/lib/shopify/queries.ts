// GraphQL queries for Shopify Storefront API
import { CART_FIELDS } from './mutations';

// Fragment for product fields used across multiple queries
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    tags
    productType
    availableForSale
    totalInventory
    vendor
  }
`;

// Fragment for collection fields
const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`;

// Products
export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query getProducts($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...ProductFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PRODUCT_RECOMMENDATIONS = `
  ${PRODUCT_FRAGMENT}
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
`;

export const GET_ALL_PRODUCT_HANDLES = `
  query getAllProductHandles($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

// Collections
export const GET_COLLECTION_BY_HANDLE = `
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  query getCollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      ...CollectionFields
      products(first: $first, after: $after) {
        edges {
          node {
            ...ProductFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

export const GET_COLLECTIONS = `
  ${COLLECTION_FRAGMENT}
  query getCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          ...CollectionFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

// Cart
export const GET_CART = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

// Search
export const SEARCH_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query searchProducts($query: String!, $first: Int!, $after: String, $sortKey: SearchSortKeys, $reverse: Boolean) {
    search(query: $query, first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, types: PRODUCT) {
      edges {
        node {
          ... on Product {
            ...ProductFields
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const PREDICTIVE_SEARCH = `
  ${PRODUCT_FRAGMENT}
  ${COLLECTION_FRAGMENT}
  query predictiveSearch($query: String!, $first: Int!) {
    predictiveSearch(query: $query, limitScope: ALL, first: $first) {
      products {
        ...ProductFields
      }
      collections {
        ...CollectionFields
      }
      queries {
        text
        storeId
      }
    }
  }
`;

// Policies
export const GET_SHOP_POLICIES = `
  query getShopPolicies {
    shop {
      privacyPolicy {
        id
        handle
        title
        body
        url
      }
      refundPolicy {
        id
        handle
        title
        body
        url
      }
      termsOfService {
        id
        handle
        title
        body
        url
      }
      shippingPolicy {
        id
        handle
        title
        body
        url
      }
    }
  }
`;

// Customer
export const GET_CUSTOMER = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            fulfillmentStatus
            financialStatus
            statusUrl
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
    }
  }
`;

// Shop Info
export const GET_SHOP_INFO = `
  query getShopInfo {
    shop {
      name
      primaryDomain {
        url
      }
      shipsToCountries
    }
  }
`;

// Localization
export const GET_LOCALIZATION = `
  query getLocalization {
    localization {
      availableCountries {
        isoCode
        name
      }
    }
  }
`;

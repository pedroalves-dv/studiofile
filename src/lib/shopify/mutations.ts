// GraphQL mutations for Shopify Storefront API

// Shared cart fields — used by all cart mutations and GET_CART query
export const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }

  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            quantityAvailable
            selectedOptions { name value }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText }
            product { title handle }
          }
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
       discountAllocations {
  discountedAmount { amount currencyCode }
}
        attributes { key value }
      }
    }
  }
  discountCodes { code applicable }
  note
`;

// Cart Mutations
export const CART_CREATE = `
  mutation createCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE = `
  mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_DISCOUNT_CODES_UPDATE = `
  mutation updateDiscountCodes($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

export const CART_NOTE_UPDATE = `
  mutation updateCartNote($cartId: ID!, $note: String!) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

// Customer Authentication Mutations
export const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

// Customer Mutations
export const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_RECOVER = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_RESET = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
        email
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_UPDATE = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Customer Address Mutations
export const CUSTOMER_ADDRESS_CREATE = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_UPDATE = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_DEFAULT_ADDRESS_UPDATE = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken
      addressId: $addressId
    ) {
      customer {
        id
        defaultAddress { id }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Formatting utility functions
import type { MoneyV2 } from '../shopify/types';
import { CURRENCY_CODE } from '../constants';

/**
 * Format price as currency
 * @example formatPrice("120.00", "USD") → "$120.00"
 * @example formatPrice("120.00", "EUR") → "€120.00"
 */
export function formatPrice(amount: string, currencyCode: string = CURRENCY_CODE): string {
  const numAmount = parseFloat(amount);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numAmount);
}

/**
 * Format date string
 * @example formatDate("2026-03-07T00:00:00Z") → "March 7, 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncate text to specified length
 * @example truncate("Hello world", 5) → "Hello..."
 */
export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + '...';
}

/**
 * Check if product is on sale (has compareAtPrice)
 */
export function isOnSale(
  price: MoneyV2,
  compareAtPrice?: MoneyV2 | null
): boolean {
  if (!compareAtPrice) return false;

  const current = parseFloat(price.amount);
  const original = parseFloat(compareAtPrice.amount);

  return current < original;
}

/**
 * Calculate discount percentage
 * @example getDiscountPercent({ amount: "100" }, { amount: "150" }) → 33 (33% off)
 */
export function getDiscountPercent(
  price: MoneyV2,
  compareAtPrice: MoneyV2
): number {
  const current = parseFloat(price.amount);
  const original = parseFloat(compareAtPrice.amount);

  if (original === 0) return 0;

  const discount = ((original - current) / original) * 100;
  return Math.round(discount);
}

// Merge classNames with automatic Tailwind CSS conflict resolution
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge multiple className values with Tailwind CSS conflict resolution
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500')
 * cn('px-2', 'px-4') → 'px-4' (rightmost wins)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

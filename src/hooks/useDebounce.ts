// Custom hook for debouncing
'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Store the latest callback in a ref so the debounced function never goes stale
  // even when the caller doesn't memoize the callback.
  const callbackRef = useRef<T>(callback);
  useEffect(() => { callbackRef.current = callback; }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;
}

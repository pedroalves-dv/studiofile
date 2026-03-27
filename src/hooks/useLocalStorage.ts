"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Always start with initialValue so server and client match during hydration.
  // localStorage is read in a mount effect to avoid SSR mismatch.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch {
      // localStorage unavailable or corrupted — keep initialValue
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const resolved = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          }
        } catch (error) {
          console.error(error);
        }
        return resolved;
      });
    },
    [key],
  );

  return [storedValue, setValue] as const;
}

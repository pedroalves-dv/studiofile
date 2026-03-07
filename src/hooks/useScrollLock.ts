// Custom hook for scroll lock
'use client';

import { useEffect } from 'react';

export function useScrollLock(locked: boolean = false) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);
}

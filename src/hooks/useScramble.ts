// src/hooks/useScramble.ts
import { useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function useScramble(originalText: string) {
  const frameRef = useRef<number | null>(null);
  const iterationRef = useRef(0);
  const elRef = useRef<HTMLSpanElement | null>(null);

  const scramble = useCallback(() => {
    if (!elRef.current) return;
    const len = originalText.length;
    const run = () => {
      if (!elRef.current) return;
      elRef.current.textContent = originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iterationRef.current) return originalText[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      if (iterationRef.current < len) {
        iterationRef.current += 0.09;
        frameRef.current = requestAnimationFrame(run);
      }
    };
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    iterationRef.current = 0;
    run();
  }, [originalText]);

  const reset = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (elRef.current) elRef.current.textContent = originalText;
  }, [originalText]);

  return { elRef, scramble, reset };
}
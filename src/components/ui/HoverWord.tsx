// ─── HoverWord ────────────────────────────────────────────────────────────────
// Fires onHover/onLeave up to the parent. Image renders as a sibling
// BELOW the text block in the section — never overlaps text.

import type { ReactNode } from 'react';

type HoverWordProps = {
  href: string;
  src?: string;
  alt?: string;
  children: ReactNode;
  onHover?: (src: string, alt: string) => void;
  onLeave?: () => void;
};

export const HoverWord = ({
  href,
  src,
  alt = "",
  children,
  onHover,
  onLeave,
}: HoverWordProps) => (
  <span
    className="inline-block"
    onMouseEnter={() => src && onHover?.(src, alt)}
    onMouseLeave={() => onLeave?.()}
  >
    <a
      href={href}
      className="text-ink underline underline-offset-4 decoration-ink/30 
      hover:decoration-ink transition-all"
    >
      {children}
    </a>
  </span>
);

export default HoverWord;
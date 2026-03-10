'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type ArrowButtonBase = {
  label: string;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
};

type AsButton = ArrowButtonBase & {
  href?: undefined;
  type?: 'submit' | 'button' | 'reset';
};

type AsLink = ArrowButtonBase & {
  href: string;
  type?: never;
};

type ArrowButtonProps = AsButton | AsLink;

export function ArrowButton({ label, onClick, className, glowColor, ...rest }: ArrowButtonProps) {
  
  const inner = (
    <span className="relative inline-flex items-center hover:">
      <span className="absolute -left-5 opacity-0 -translate-x-3 transition-all duration-400 
      ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-3">
        →
      </span>
      <span className="transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-2">
        {label}
      </span>
    </span>
  );

    const glow = (
    <span
      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
      aria-hidden="true"
    >
      <span
        className="w-5/6 h-1/3 rounded-full"
        style={{ background: glowColor, filter: 'blur(12px)', opacity: 0.50 }}
      />
    </span>
  );

  if ('href' in rest && rest.href !== undefined) {
    return (
      <Link href={rest.href} onClick={onClick} className={cn('group relative', className)}>
        {glow}
        {inner}
      </Link>
    );
  }

  const { type = 'button' } = rest as AsButton;
  return (
    <button type={type} onClick={onClick} className={cn('group relative', className)}>
      {glow}
      {inner}
    </button>
  );
}

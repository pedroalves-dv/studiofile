'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type ArrowButtonBase = {
  label: string;
  className?: string;
  onClick?: () => void;
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

export function ArrowButton({ label, onClick, className, ...rest }: ArrowButtonProps) {
  const inner = (
    <span className="relative inline-flex items-center">
      <span className="absolute -left-5 opacity-0 -translate-x-3 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-3">
        →
      </span>
      <span className="transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-2">
        {label}
      </span>
    </span>
  );

  if ('href' in rest && rest.href !== undefined) {
    return (
      <Link href={rest.href} onClick={onClick} className={cn('group relative', className)}>
        {inner}
      </Link>
    );
  }

  const { type = 'button' } = rest as AsButton;
  return (
    <button type={type} onClick={onClick} className={cn('group relative', className)}>
      {inner}
    </button>
  );
}

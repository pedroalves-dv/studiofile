'use client';

import { Slot } from '@radix-ui/react-slot';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const baseStyles =
    'relative inline-flex items-center justify-center text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-ink text-white rounded-lg',
    secondary: 'border border-ink text-ink hover:bg-ink hover:text-canvas',
    ghost: 'text-ink hover:bg-stone-50',
    link: 'text-ink underline hover:text-accent',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <Comp
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader size={16} className="absolute animate-spin" />
          <span className="opacity-0">{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

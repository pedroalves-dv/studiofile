'use client';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

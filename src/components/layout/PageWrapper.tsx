import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageWrapper({ children, className, narrow }: PageWrapperProps) {
  return (
    <div
      className={cn(narrow ? 'container-narrow' : 'container-wide', 'section-padding', className)}
    >
      {children}
    </div>
  );
}

import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main id="main-content" className={`container-wide section-padding ${className || ''}`}>
      {children}
    </main>
  );
}

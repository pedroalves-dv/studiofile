'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl text-ink mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button variant="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

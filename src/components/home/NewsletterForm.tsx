'use client';

import { Button } from '@/components/ui/Button';

export function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="hello@example.com"
        className="flex-1 px-4 py-3 bg-canvas/10 text-canvas placeholder-canvas/50 border border-canvas/20 focus:border-accent outline-none transition-colors"
        required
      />
      <Button variant="primary" className="sm:w-auto">
        Subscribe
      </Button>
    </form>
  );
}

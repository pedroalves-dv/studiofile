import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-[20vw] leading-none text-stone-200 mb-8">404</h1>
      <div className="text-center max-w-md mb-12">
        <h2 className="text-2xl font-display text-ink mb-4">Page not found.</h2>
        <p className="text-muted mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
        <Link href="/shop">
          <Button variant="secondary">Shop All</Button>
        </Link>
      </div>
    </div>
  );
}

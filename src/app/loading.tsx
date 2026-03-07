import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header skeleton */}
      <div className="bg-canvas border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <Skeleton className="h-16 w-2/3 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-8" />
            <Skeleton className="h-12 w-32" />
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

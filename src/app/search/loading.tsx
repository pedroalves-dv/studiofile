import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonCard } from '@/components/common/SkeletonCard';

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

      {/* Search bar skeleton */}
      <div className="section-padding border-b border-border">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-full max-w-md" />
        </div>
      </div>

      {/* Results info skeleton */}
      <div className="section-padding border-b border-border">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-6 w-64" />
        </div>
      </div>

      {/* Results grid skeleton */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
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

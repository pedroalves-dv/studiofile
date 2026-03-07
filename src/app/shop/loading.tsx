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

      {/* Page title skeleton */}
      <div className="section-padding border-b border-border">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>

      {/* Filters and sorting skeleton */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 mb-12">
            {/* Filter sidebar skeleton */}
            <div className="w-56 hidden lg:flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>

            {/* Products grid skeleton */}
            <div className="flex-1">
              <Skeleton className="h-10 w-40 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

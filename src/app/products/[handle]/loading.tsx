import { Skeleton } from '@/components/ui/Skeleton';

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

      {/* Product details skeleton */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image skeleton */}
            <div className="aspect-[3/4] overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Product info skeleton */}
            <div className="flex flex-col">
              {/* Title */}
              <Skeleton className="h-10 w-3/4 mb-4" />

              {/* Price */}
              <div className="flex gap-4 mb-8">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>

              {/* Description */}
              <div className="mb-8 flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Variant selector skeleton */}
              <div className="mb-8">
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="flex gap-2 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-12" />
                  ))}
                </div>
              </div>

              {/* Add to cart button skeleton */}
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonCard } from '@/components/common/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header height shimmer */}
      <Skeleton className="h-16 w-full" />

      {/* Hero: full-viewport-height */}
      <Skeleton className="w-full h-screen" />

      {/* Row of 4 product cards */}
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

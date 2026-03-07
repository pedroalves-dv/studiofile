import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonCard } from '@/components/common/SkeletonCard';

export default function Loading() {
  return (
    <div className="container-wide section-padding">
      {/* Collection banner / title */}
      <Skeleton className="w-full h-48 mb-12" />

      {/* Product grid: 8 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

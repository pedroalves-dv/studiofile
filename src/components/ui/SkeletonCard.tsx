import { Skeleton } from '@/components/ui/Skeleton';

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      {/* Image placeholder */}
      <div className="aspect-[3/4] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Product name skeleton */}
      <Skeleton className="h-4 w-3/4" />
      
      {/* Price skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

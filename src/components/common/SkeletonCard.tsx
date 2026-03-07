import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/Skeleton';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Skeleton className="w-full aspect-[4/5]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

import { SkeletonCard } from "@/components/common/SkeletonCard";

export default function Loading() {
  return (
    <div className="px-site page-pt page-pb">
      {/* Skeleton header */}
      <div className="h-20 sm:h-36 w-48 sm:w-72 bg-stroke/40 animate-pulse mb-6 mt-4" />
      <div className="border-b border-stroke -mx-site mb-6" />
      {/* Controls placeholder */}
      <div className="h-8 w-96 bg-stroke/30 animate-pulse mb-8 rounded-sm" />
      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

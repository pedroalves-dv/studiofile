export function SkeletonCard() {
  return (
    <div className="border border-border overflow-hidden">
      <div className="h-64 bg-stone-100 animate-pulse"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-stone-100 w-3/4 animate-pulse"></div>
        <div className="h-4 bg-stone-100 w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}

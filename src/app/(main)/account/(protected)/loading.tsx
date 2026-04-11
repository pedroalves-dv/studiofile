import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div>
      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48 rounded-sm" />
        </div>
        <div className="flex flex-col divide-y divide-stroke border border-stroke">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded-sm" />
                <Skeleton className="h-3 w-24 rounded-sm" />
              </div>
              <Skeleton className="h-4 w-16 rounded-sm" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Skeleton } from "@/components/ui/Skeleton";

export default function OrdersLoading() {
  return (
    <div>
      <section>
        <div className="mb-6">
          <Skeleton className="h-10 w-32 rounded-sm" />
        </div>
        <div className="flex flex-col divide-y divide-stroke border border-stroke">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40 rounded-sm" />
                <Skeleton className="h-3 w-28 rounded-sm" />
              </div>
              <Skeleton className="h-4 w-20 rounded-sm" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

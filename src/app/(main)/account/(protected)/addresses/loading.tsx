import { Skeleton } from "@/components/ui/Skeleton";

export default function AddressesLoading() {
  return (
    <div>
      <section>
        <div className="mb-6">
          <Skeleton className="h-10 w-36 rounded-sm" />
        </div>
        <div className="border border-stroke rounded-md p-4 mb-12">
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border border-stroke rounded-sm p-4 flex justify-between items-start"
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-40 rounded-sm" />
                  <Skeleton className="h-3 w-56 rounded-sm" />
                  <Skeleton className="h-3 w-32 rounded-sm" />
                </div>
                <Skeleton className="h-8 w-16 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div>
      <section>
        <div className="mb-6">
          <Skeleton className="h-10 w-32 rounded-sm" />
        </div>
        <div className="border border-stroke rounded-md p-4 mb-12">
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24 rounded-sm" />
                <Skeleton className="h-10 w-full rounded-sm" />
              </div>
            ))}
            <Skeleton className="h-10 w-32 rounded-md mt-2" />
          </div>
        </div>
      </section>
    </div>
  );
}

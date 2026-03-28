import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCollections } from "@/lib/shopify/collections";

export function CollectionsSkeleton() {
  return (
    <div className="section-padding border-b border-stroke">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({
            length: 3,
          }).map((_, i) => (
            <div key={i} className="aspect-[3/4]">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function CollectionsSection() {
  try {
    const collections = await getCollections();

    if (!collections || collections.length === 0) {
      return null;
    }

    return (
      <section className="section-padding border-b border-ink/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-4xl md:text-7xl text-ink">
              Shop by Collection
            </h2>
            <Link
              href="/collections"
              className="text-sm uppercase tracking-wider hover:underline"
            >
              All Collections →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group relative aspect-[3/4] overflow-hidden bg-stone-100"
              >
                {collection.image?.url && (
                  <Image
                    src={collection.image.url}
                    alt={collection.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform 
                    duration-500"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 
                to-transparent flex flex-col justify-end p-6"
                >
                  <h3 className="text-2xl text-canvas">{collection.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching collections:", error);
    return null;
  }
}

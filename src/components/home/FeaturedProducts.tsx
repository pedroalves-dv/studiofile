import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify/products";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/Skeleton";

export function FeaturedProductsSkeleton() {
  return (
    <div className="section-padding border-b border-stroke">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[400px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={i === 3 ? "md:col-span-1 md:row-span-2" : ""}
            >
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function FeaturedProducts() {
  try {
    const productsResult = await getProducts({
      first: 4,
      sortKey: "BEST_SELLING",
    });
    const products = productsResult?.edges?.map((edge) => edge.node) ?? [];

    if (products.length === 0) return null;

    return (
      <section className="relative flex items-center min-h-dvh border border-green-500 mt-60">
        {/* Section heading */}
        <div className="flex justify-between items-baseline border-b border-stroke pb-4">
          <span className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] tracking-tight">
            SELECTED
          </span>
          <span className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] tracking-tight">
            WORKS
          </span>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-[5fr_2fr] gap-0">
          {/* Dominant — left */}
          {products[0] && (
            <Link
              href={`/products/${products[0].handle}`}
              className="group block border-r border-stroke"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {products[0].featuredImage ? (
                  <Image
                    src={products[0].featuredImage.url}
                    alt={products[0].featuredImage.altText ?? products[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 70vw"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100" />
                )}
              </div>
              <div className="p-4 border-t border-stroke">
                <h3 className="font-mono font-bold text-xl">
                  {products[0].title}
                </h3>
                <p className="font-mono text-sm text-muted mt-1">
                  {formatPrice(
                    products[0].priceRange.minVariantPrice.amount,
                    products[0].priceRange.minVariantPrice.currencyCode,
                  )}
                </p>
              </div>
            </Link>
          )}

          {/* Three secondary — right, stacked */}
          <div className="flex flex-col">
            {products.slice(1, 4).map((p, i) => (
              <Link
                key={p.id}
                href={`/products/${p.handle}`}
                className={cn(
                  "group block flex-1",
                  i > 0 && "border-t border-stroke",
                )}
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  {p.featuredImage ? (
                    <Image
                      src={p.featuredImage.url}
                      alt={p.featuredImage.altText ?? p.title}
                      fill
                      className="object-cover"
                      sizes="30vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100" />
                  )}
                </div>
                <div className="px-3 py-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider truncate">
                    {p.title}
                  </h3>
                  <p className="font-mono text-xs text-muted mt-0.5">
                    {formatPrice(
                      p.priceRange.minVariantPrice.amount,
                      p.priceRange.minVariantPrice.currencyCode,
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <div className="flex justify-end pt-4">
          <Link
            href="/shop"
            className="font-mono text-xs text-muted hover:text-ink transition-colors uppercase tracking-wider"
          >
            → All Works
          </Link>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return null;
  }
}

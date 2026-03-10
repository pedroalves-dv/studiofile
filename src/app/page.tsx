import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";
import { HeroContent } from "@/components/home/HeroContent";
import { getProducts } from "@/lib/shopify/products";
import { getCollections } from "@/lib/shopify/collections";
import BrandStory from "@/components/home/BrandStory";

export const metadata: Metadata = {
  title: "3d printing & design studio",
  description:
    "Studiofile: Modular, functional home decor and furniture crafted through 3D printing. Designed in Paris, made to order, shipped worldwide.",
};

// Skeleton components for Suspense fallbacks
function HeroSkeleton() {
  return (
    <div className="relative h-screen flex items-center">
      <div className="flex-1 px-6 md:px-12 py-20">
        <div className="max-w-2xl">
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
      <div className="flex-1 relative h-full bg-stone-100">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}

function FeaturedProductsSkeleton() {
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

function CollectionsSkeleton() {
  return (
    <div className="section-padding border-b border-stroke">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[3/4]">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hero Section
async function Hero() {
  try {
    const productsResult = await getProducts({
      first: 1,
      sortKey: "BEST_SELLING",
    });
    const featuredProduct = productsResult?.edges?.[0]?.node;
    const heroImage = featuredProduct?.images?.[0]?.url;

    return (
      <section className="relative w-full min-h-screen flex items-center px-4">
        {/* Left content — client component owns heading animation */}
        <div className="flex flex-col h-full z-10 md:w-3/4 lg:w-2/3 flex-1 
          items-center">
          <HeroContent />
        </div>

        {/* Right image */}
        <div className="absolute flex-1 hidden md:block border border-purple-500">
          {heroImage && (
            <Image
              src={heroImage}
              alt={featuredProduct?.title || "Featured Product"}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return <HeroSkeleton />;
  }
}

// Featured Products Section
async function FeaturedProductsSection() {
  try {
    const productsResult = await getProducts({
      first: 4,
      sortKey: "BEST_SELLING",
    });
    const products = productsResult?.edges?.map((edge) => edge.node) || [];

    if (!products || products.length === 0) {
      return null;
    }

    return (
      <section className="border-b border-stroke">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-ink">
              Selected Works
            </h2>
            <Link
              href="/shop"
              className="text-sm font-mono uppercase tracking-wider hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[400px]">
            {products.map((product, i) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className={`group relative overflow-hidden bg-stone-100 ${
                  i === 3 ? "md:col-span-1 md:row-span-2" : ""
                }`}
              >
                {product.images?.[0]?.url && (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="font-display text-xl text-canvas mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-canvas/80">
                    ${product.priceRange.minVariantPrice.amount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return null;
  }
}

// Collections Section
async function CollectionsSection() {
  try {
    const collections = await getCollections();

    if (!collections || collections.length === 0) {
      return null;
    }

    return (
      <section className="section-padding border-b border-ink/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display uppercase text-4xl md:text-7xl text-ink">
              Shop by Collection
            </h2>
            <Link
              href="/collections"
              className="text-sm font-mono uppercase tracking-wider hover:underline"
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
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-display text-2xl text-canvas">
                    {collection.title}
                  </h3>
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

// Process Section
function ProcessSection() {
  const steps = [
    {
      number: "/01",
      title: "Designed In-Studio",
      description:
        "Each object is meticulously designed by our team, balancing form and function.",
    },
    {
      number: "/02",
      title: "Printed to Order",
      description:
        "Made fresh using precision 3D printing, minimizing waste and maximizing quality.",
    },
    {
      number: "/03",
      title: "Shipped to You",
      description:
        "Carefully packaged and delivered worldwide. Every piece arrives in perfect condition.",
    },
    {
      number: "/04",
      title: "Upgrade / Repair / Replace",
      description:
        "Carefully packaged and delivered worldwide. Every piece arrives in perfect condition.",
    },
  ];

  return (
    <section className="relative flex flex-col w-full min-h-screen items-center border border-green-500 mt-60">
      <div className="flex-1 min-h-full w-full border border-purple-500">
        {/* <h2 className="font-display text-4xl md:text-5xl text-ink mb-16 text-center">How It Works</h2> */}

        <div className="grid grid-cols-1 md:grid-cols-1">
          {steps.map((step, i) => (
            <div key={i} className="border-b border-stroke">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 container-wide py-4">
                <div className="flex justify-end font-display text-6xl font-semibold text-ink">
                  {step.number}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-serif italic text-3xl text-ink">
                    {step.title}
                  </h3>
                  <p className="font-serif text-3xl text-light leading-none">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Bottom Hero
function BottomHeroSection() {
  return (
    <section className="w-full h-full flex justify-center 
    items-center mt-60 border border-yellow-500">
      <div
              className="w-96 bg-accent"
              style={{
                aspectRatio: "43.710445 / 237.04541",
                maskImage: "url(/images/logo/logo-large-vertical.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center left",
              }}
            />
      {/* <div className="bg-accent h-[300px] w-full -mt-12"></div> */}
    </section>
  );
}

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      {/* Featured Products */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Brand Story */}
      <BrandStory />

      {/* Collections */}
      {/* <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsSection />
      </Suspense> */}

      {/* Process */}
      <ProcessSection />

      {/* Bottom Hero */}
      <BottomHeroSection />

      
    </>
  );
}

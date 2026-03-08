import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { getProducts } from '@/lib/shopify/products';
import { getCollections } from '@/lib/shopify/collections';

export const metadata: Metadata = {
  title: 'Premium 3D Printed Furniture & Home Decor',
  description: 'Studiofile: Modular, functional home decor and furniture crafted through 3D printing. Designed in Paris, made to order, shipped worldwide.',
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
    <div className="section-padding border-b border-border">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[400px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={i === 3 ? 'md:col-span-1 md:row-span-2' : ''}>
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
    <div className="section-padding border-b border-border">
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
    const productsResult = await getProducts({ first: 1, sortKey: 'BEST_SELLING' });
    const featuredProduct = productsResult?.edges?.[0]?.node;
    const heroImage = featuredProduct?.images?.[0]?.url;

    return (
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Left content */}
        <div className="flex-1 px-6 md:px-12 py-20 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="font-display text-6xl md:text-7xl leading-tight text-ink mb-6">
              Objects made <br />
              to last.
            </h1>
            <p className="text-lg text-muted mb-8 max-w-md">
              Modular, functional home decor and furniture crafted through precision 3D printing. Designed in Paris, made to order.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/shop">
                <Button variant="primary">Shop All</Button>
              </Link>
              <Link href="/collections">
                <Button variant="ghost">View Collections</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 relative h-full bg-stone-100 hidden md:block">
          {heroImage && (
            <Image
              src={heroImage}
              alt={featuredProduct?.title || 'Featured Product'}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return <HeroSkeleton />;
  }
}

// Marquee Section
function Marquee() {
  return (
    <div className="border-y border-border bg-canvas overflow-hidden py-6">
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content {
          animation: scroll-left 30s linear infinite;
          white-space: nowrap;
        }
      `}</style>
      <div className="flex">
        <div className="marquee-content flex items-center gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="font-mono text-sm uppercase tracking-widest text-muted-foreground"
            >
              3D-PRINTED · MADE TO ORDER · DESIGNED IN PARIS · MODULAR OBJECTS ·
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Featured Products Section
async function FeaturedProductsSection() {
  try {
    const productsResult = await getProducts({ first: 4, sortKey: 'BEST_SELLING' });
    const products = productsResult?.edges?.map((edge) => edge.node) || [];

    if (!products || products.length === 0) {
      return null;
    }

    return (
      <section className="section-padding border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-ink">Selected Works</h2>
            <Link href="/shop" className="text-sm font-mono uppercase tracking-wider hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[400px]">
            {products.map((product, i) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className={`group relative overflow-hidden bg-stone-100 ${
                  i === 3 ? 'md:col-span-1 md:row-span-2' : ''
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
                  <h3 className="font-display text-xl text-canvas mb-2">{product.title}</h3>
                  <p className="text-sm text-canvas/80">${product.priceRange.minVariantPrice.amount}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return null;
  }
}

// Brand Story Section
function BrandStory() {
  return (
    <section className="section-padding border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left: Large accent shape */}
        <div className="flex items-center justify-center md:justify-start h-96">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 border border-border" />
            <div className="text-[150px] md:text-[200px] font-display text-stone-200 leading-none">
              &
            </div>
          </div>
        </div>

        {/* Right: Story text */}
        <div className="flex flex-col justify-center gap-8">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-6">About the Studio</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-5">
              Studiofile is a design studio founded in Paris, specializing in modular furniture and functional home decor created through precision 3D printing. Our objects blend architectural thinking with craft sensibility, resulting in pieces that are both conceptually rigorous and tactilely rewarding.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Each piece is made to order, ensuring minimal waste and maximum customization. We work with premium materials to create objects that transcend trends—pieces designed to be lived with, repaired, and loved for years to come.
            </p>
          </div>
          <Link href="/about" className="text-sm font-mono uppercase tracking-wider hover:underline w-fit">
            Read Our Story →
          </Link>
        </div>
      </div>
    </section>
  );
}

// Collections Section
async function CollectionsSection() {
  try {
    const collections = await getCollections();

    if (!collections || collections.length === 0) {
      return null;
    }

    return (
      <section className="section-padding border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-ink">Shop by Collection</h2>
            <Link href="/collections" className="text-sm font-mono uppercase tracking-wider hover:underline">
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
                  <h3 className="font-display text-2xl text-canvas">{collection.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching collections:', error);
    return null;
  }
}

// Process Section
function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Designed In-Studio',
      description: 'Each object is meticulously designed by our team, balancing form and function.',
    },
    {
      number: '02',
      title: 'Printed to Order',
      description: 'Made fresh using precision 3D printing, minimizing waste and maximizing quality.',
    },
    {
      number: '03',
      title: 'Shipped to You',
      description: 'Carefully packaged and delivered worldwide. Every piece arrives in perfect condition.',
    },
  ];

  return (
    <section className="section-padding border-b border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-16 text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col">
              <div className="font-mono text-lg font-semibold text-accent mb-6">{step.number}</div>
              <h3 className="font-display text-2xl text-ink mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
// function NewsletterSection() {
//   return (
//     <section className="bg-ink text-canvas section-padding">
//       <div className="max-w-2xl mx-auto text-center">
//         <h2 className="font-display text-4xl md:text-5xl mb-6">Stay in the loop.</h2>
//         <p className="text-canvas/80 mb-8">
//           Get updates on new releases, studio stories, and special offers.
//         </p>
//         <NewsletterForm />
//       </div>
//     </section>
//   );
// }

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      {/* Marquee */}
      <Marquee />

      {/* Featured Products */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Brand Story */}
      <BrandStory />

      {/* Collections */}
      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsSection />
      </Suspense>

      {/* Process */}
      <ProcessSection />

      {/* Newsletter */}
      {/* <NewsletterSection /> */}
    </>
  );
}

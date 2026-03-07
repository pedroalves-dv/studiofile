import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify/collections';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageWrapper } from '@/components/layout/PageWrapper';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Collections — Studiofile',
    description: 'Explore our curated collections of 3D printed furniture and home decor.',
  };
}

export default async function CollectionsPage() {
  let collections = [];
  let error = null;

  try {
    collections = await getCollections();
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    error = true;
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
  ];

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbs} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="font-display text-[clamp(2.5rem, 8vw, 5rem)] leading-tight mb-16 text-ink">
            Collections
          </h1>

          {/* Collections Grid */}
          {collections && collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => {
                const { handle, title, image, products } = collection;
                const productCount = products?.edges?.length || 0;

                return (
                  <Link
                    key={handle}
                    href={`/collections/${handle}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      {/* Image with hover scale */}
                      {image && image.url ? (
                        <Image
                          src={image.url}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-100">
                          <span className="text-stone-400 font-display text-lg">
                            {title}
                          </span>
                        </div>
                      )}

                      {/* Gradient scrim and text overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 from-0% via-transparent via-50% to-transparent flex flex-col justify-end p-6">
                        <h2 className="font-display text-2xl md:text-3xl leading-tight text-canvas mb-2">
                          {title}
                        </h2>
                        <p className="font-mono text-xs uppercase tracking-widest text-stone-300">
                          {productCount} {productCount === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : error ? (
            // Error state
            <div className="py-20 text-center">
              <p className="text-ink/60 mb-4">Unable to load collections at this time.</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 border border-ink text-ink hover:bg-ink hover:text-canvas transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            // Empty state
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-ink mb-4">Coming Soon</p>
              <p className="text-ink/60 max-w-md mx-auto mb-8">
                We're curating a thoughtful selection of collections. Check back soon.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 border border-ink text-ink hover:bg-ink hover:text-canvas transition-colors"
              >
                Browse Shop
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

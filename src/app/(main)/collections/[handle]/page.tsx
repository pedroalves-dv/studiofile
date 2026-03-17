import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import { getCollectionWithPagination } from '@/lib/shopify/collections';
import { buildCollectionMetadata } from '@/lib/utils/seo';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SortSelect } from '@/components/search/SortSelect';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SkeletonCard } from '@/components/common/SkeletonCard';

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata(
  { params }: CollectionPageProps
): Promise<Metadata> {
  const { handle } = await params;

  try {
    const collection = await getCollectionWithPagination(handle, 1);
    if (!collection) return { title: 'Collection — Studiofile' };
    return buildCollectionMetadata(collection);
  } catch {
    return { title: 'Collection — Studiofile' };
  }
}

async function CollectionProducts(props: {
  handle: string;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.searchParams;
  let products = [];
  let error = null;

  try {
    const collection = await getCollectionWithPagination(
      props.handle,
      24,
      (params.cursor as string) || undefined
    );

    if (!collection) {
      return (
        <div className="py-20 text-center">
          <p className="text-ink/60">Collection not found.</p>
        </div>
      );
    }

    products = collection.products || [];
  } catch (err) {
    console.error('Failed to fetch collection:', err);
    error = true;
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60 mb-4">Unable to load collection at this time.</p>
        <p className="text-sm text-ink/40">Please try again later.</p>
      </div>
    );
  }

  return <ProductGrid products={products} totalCount={products.length} />;
}

export default async function CollectionPage(props: CollectionPageProps) {
  const { handle } = await props.params;
  const searchParams = await props.searchParams;

  let collection = null;
  let error = null;

  try {
    collection = await getCollectionWithPagination(handle, 1);
  } catch (err) {
    console.error('Failed to fetch collection:', err);
    error = true;
  }

  if (error) {
    return (
      <PageWrapper>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
          ]}
        />
        <section className="section-padding">
          <div className="max-w-7xl mx-auto py-20 text-center">
            <p className="text-ink/60">Unable to load collection at this time.</p>
          </div>
        </section>
      </PageWrapper>
    );
  }

  if (!collection) notFound();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: collection.title, href: `/collections/${handle}` },
  ];

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbs} />

      {/* Collection banner */}
      {collection.image && (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-stone-100">
          <Image
            src={collection.image.url}
            alt={collection.title}
            fill
            className="object-cover"
            priority
          />
          {/* Text overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6 md:p-12">
            <h1 className="font-display text-[clamp(2rem, 8vw, 4rem)] leading-tight text-canvas mb-4">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-canvas/90 max-w-2xl text-base md:text-lg">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      )}

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {!collection.image && (
            <>
              <h1 className="font-display text-[clamp(2.5rem, 8vw, 5rem)] leading-tight mb-4 text-ink">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-ink/70 max-w-2xl mb-12 text-lg">
                  {collection.description}
                </p>
              )}
            </>
          )}

          {/* Controls row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-6 border-b border-border">
            <SortSelect />
            <FilterPanel />
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            {/* Desktop filter sidebar */}
            <div className="hidden md:block">
              <FilterPanel />
            </div>

            {/* Products grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <CollectionProducts handle={handle} searchParams={Promise.resolve(searchParams)} />
            </Suspense>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

import { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/lib/shopify/products';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SortSelect } from '@/components/shop/SortSelect';
import { FilterPanel } from '@/components/shop/FilterPanel';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export const metadata: Metadata = {
  title: 'Shop — Studiofile',
  description:
    'Explore our complete collection of premium 3D printed furniture and home décor.',
};

interface ShopPageProps {
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

async function ShopContent({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  let products = [];
  let error = null;

  try {
    // Parse sort parameter
    let sortKey = 'BEST_SELLING';
    let reverse = false;

    const sortParam = params.sort as string | undefined;
    if (sortParam === 'PRICE') {
      sortKey = 'PRICE';
      reverse = params.reverse === 'true';
    } else if (sortParam === 'CREATED') {
      sortKey = 'CREATED';
    } else if (sortParam && ['TITLE', 'RELEVANCE'].includes(sortParam)) {
      sortKey = sortParam as any;
    }

    const result = await getProducts({
      first: 24,
      after: (params.cursor as string) || undefined,
      sortKey: sortKey as any,
      reverse,
      query: (params.q as string) || undefined,
    });

    products = result.edges.map((edge: any) => edge.node);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error = true;
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60 mb-4">Unable to load products at this time.</p>
        <p className="text-sm text-ink/40">Please try again later.</p>
      </div>
    );
  }

  return <ProductGrid products={products} totalCount={24} />;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbs} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="font-display text-[clamp(2.5rem, 8vw, 5rem)] leading-tight mb-12 text-ink">
            Shop
          </h1>

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
              <ShopContent searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

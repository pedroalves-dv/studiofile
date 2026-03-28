import { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify/products";
import { SITE_URL } from "@/lib/utils/seo";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SortSelect } from "@/components/search/SortSelect";
import { FilterPanel } from "@/components/search/FilterPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SkeletonCard } from "@/components/common/SkeletonCard";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shop",
    description: "Browse all products.",
    alternates: { canonical: `${SITE_URL}/shop` },
  };
}

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
  type SortKey = "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED" | "RELEVANCE";
  let products: import("@/lib/shopify/types").ShopifyProduct[] = [];
  let error = null;

  try {
    // Parse sort parameter — SortSelect sends PRICE with a separate reverse param
    let sortKey: SortKey = "BEST_SELLING";
    let reverse = false;

    const sortParam = params.sort as string | undefined;
    if (sortParam === "PRICE") {
      sortKey = "PRICE";
      reverse = params.reverse === "true";
    } else if (sortParam === "CREATED") {
      sortKey = "CREATED";
    } else if (sortParam === "TITLE") {
      sortKey = "TITLE";
    } else if (sortParam === "RELEVANCE") {
      sortKey = "RELEVANCE";
    }

    const result = await getProducts({
      first: 24,
      after: (params.cursor as string) || undefined,
      sortKey,
      reverse,
      query: (params.q as string) || undefined,
    });

    products = result.edges.map((edge) => edge.node);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error = true;
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60 mb-4">
          Unable to load products at this time.
        </p>
        <p className="text-sm text-ink/40">Please try again later.</p>
      </div>
    );
  }

  return <ProductGrid products={products} totalCount={24} />;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ];

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbs} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="text-[clamp(2.5rem, 8vw, 5rem)] leading-tight mb-12 text-ink">
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

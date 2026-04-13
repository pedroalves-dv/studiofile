// src/app/(main)/products/[handle]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProductRecommendations } from "@/lib/shopify/products";
import { buildProductMetadata, SITE_URL } from "@/lib/utils/seo";
import { ProductInfoPanel } from "@/components/product/ProductInfoPanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { ProductViewEvent } from "@/components/product/ProductViewEvent";
import { ImageGalleryWithZoomClient } from "@/components/product/ImageGalleryWithZoom";
import { ImageZoomGallery } from "@/components/product/ImageZoomGallery";
import { StockIndicator } from "@/components/product/StockIndicator";
import { formatPrice } from "@/lib/utils/format";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: { "@type": "Brand", name: product.vendor || "Studiofile" },
    offers: {
      "@type": "Offer",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${handle}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/* ─── Section 1 — Hero (50/50 desktop, stacked mobile) ─── */}
        <section className="px-site section-min-h pt-6 sm:page-pt page-pb">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 lg:gap-5 items-start">
            {/* Mobile header — title + price + stock, shown above gallery on mobile only */}
            <div className="md:hidden">
              {product.productType && (
                <span className="text-label text-muted">
                  {product.productType}
                </span>
              )}
              <h1 className="text-6xl font-medium tracking-[-0.07em] leading-[4rem]">
                {product.title}
              </h1>
              <div className="flex items-start gap-2 sm:gap-3 pt-2">
                <span className="text-3xl tracking-tighter text-ink translate-y-[-3px]">
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode,
                  )}
                </span>
                <StockIndicator
                  availableForSale={product.availableForSale}
                  quantityAvailable={
                    (
                      product.variants.find((v) => v.availableForSale) ??
                      product.variants[0]
                    )?.quantityAvailable ?? null
                  }
                />
              </div>
            </div>

            {/* Left — image gallery with zoom */}
            <div className="md:sticky md:top-[calc(var(--header-height)+var(--page-pt))] md:sticky-gallery-h overflow-hidden">
              <div className="h-full w-full">
                <ImageGalleryWithZoomClient
                  images={product.images}
                  productTitle={product.title}
                  productHandle={product.handle}
                />
              </div>
            </div>

            {/* Right — product info panel */}
            <ProductInfoPanel product={product} />
          </div>
        </section>

        {/* ─── Section 2 —Track this product view (client components, render null) */}
        <ProductViewTracker handle={product.handle} />
        <ProductViewEvent handle={product.handle} title={product.title} />

        {/* ─── Section 3 — Recently viewed ─── */}
        <RecentlyViewed currentHandle={product.handle} />

        {/* ─── Section 4 — Related products ─── */}
        <RelatedProducts
          products={recommendations}
          currentHandle={product.handle}
        />
      </div>
    </>
  );
}

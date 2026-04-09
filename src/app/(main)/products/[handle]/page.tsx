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
        <section className="px-5 section-height py-12 sm:py-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* Left — image gallery with zoom */}
            <div className="md:sticky md:top-28">
              <ImageGalleryWithZoomClient
                images={product.images}
                productTitle={product.title}
                productHandle={product.handle}
              />
            </div>

            {/* Right — product info panel */}
            <ProductInfoPanel product={product} />
          </div>
        </section>

        {/* ─── Section 2 — Additional image gallery (click to zoom) ─── */}
        {product.images.length > 1 && (
          <section className="border-t border-stroke section-padding">
            <div className="container-wide">
              <h2 className="text-label text-muted mb-8">Gallery</h2>
              <ImageZoomGallery
                images={product.images}
                productTitle={product.title}
              />
            </div>
          </section>
        )}

        {/* Track this product view (client components, render null) */}
        <ProductViewTracker handle={product.handle} />
        <ProductViewEvent handle={product.handle} title={product.title} />

        {/* ─── Section 4 — Recently viewed ─── */}
        <RecentlyViewed currentHandle={product.handle} />

        {/* ─── Section 5 — Related products ─── */}
        <RelatedProducts
          products={recommendations}
          currentHandle={product.handle}
        />
      </div>
    </>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, getProductRecommendations } from '@/lib/shopify/products';
import { truncate } from '@/lib/utils/format';
import { ProductInfoPanel } from '@/components/product/ProductInfoPanel';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ImageGalleryWithZoomClient } from '@/components/product/ImageGalleryWithZoom';
import { ImageZoomGallery } from '@/components/product/ImageZoomGallery';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Product not found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: product.title,
    description: truncate(product.description, 155),
    alternates: { canonical: `${siteUrl}/products/${handle}` },
    openGraph: {
      title: product.title,
      description: truncate(product.description, 155),
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width ?? 1200,
              height: product.featuredImage.height ?? 630,
              alt: product.featuredImage.altText ?? product.title,
            },
          ]
        : undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Parse "key:value" tags into a specs table
  const specs = product.tags
    .filter((tag) => tag.includes(':'))
    .map((tag) => {
      const i = tag.indexOf(':');
      return { key: tag.slice(0, i).trim(), value: tag.slice(i + 1).trim() };
    });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: { '@type': 'Brand', name: product.vendor || 'Studiofile' },
    offers: {
      '@type': 'Offer',
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${handle}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
        {/* ─── Section 1 — Hero (50/50 desktop, stacked mobile) ─── */}
        <section className="container-wide py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* Left — image gallery with zoom */}
            <div className="md:sticky md:top-24">
              <ImageGalleryWithZoomClient
                images={product.images}
                productTitle={product.title}
              />
            </div>

            {/* Right — product info panel */}
            <ProductInfoPanel product={product} />
          </div>
        </section>

        {/* ─── Section 2 — Full description + specs ─── */}
        <section className="border-t border-border section-padding">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
              <div>
                <h2 className="text-label text-muted mb-6">Product Details</h2>
                {product.descriptionHtml ? (
                  <div
                    className="text-sm text-ink/80 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_h2]:font-display [&_h2]:text-xl [&_h2]:mb-3"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                ) : (
                  <p className="text-sm text-muted">No additional details available.</p>
                )}
              </div>

              {specs.length > 0 && (
                <div>
                  <h2 className="text-label text-muted mb-6">Specifications</h2>
                  <dl className="divide-y divide-border">
                    {specs.map(({ key, value }) => (
                      <div key={key} className="flex justify-between py-3 gap-4">
                        <dt className="text-label text-muted capitalize">{key}</dt>
                        <dd className="font-mono text-xs text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── Section 3 — Additional image gallery (click to zoom) ─── */}
        {product.images.length > 1 && (
          <section className="border-t border-border section-padding">
            <div className="container-wide">
              <h2 className="text-label text-muted mb-8">Gallery</h2>
              <ImageZoomGallery images={product.images} productTitle={product.title} />
            </div>
          </section>
        )}

        {/* ─── Section 4 — Related products ─── */}
        <RelatedProducts products={recommendations} />
      </main>
    </>
  );
}

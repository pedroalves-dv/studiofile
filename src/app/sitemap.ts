import type { MetadataRoute } from "next";
import { getAllProductHandles } from "@/lib/shopify/products";
import { getCollections } from "@/lib/shopify/collections";

// Must be set in Vercel env vars — fallback is canonical domain
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studiofile.fr";

const POLICY_HANDLES = [
  "privacy-policy",
  "refund-policy",
  "terms-of-service",
  "shipping-policy",
] as const;

// Fixed date for static pages — update manually when content changes, not every deploy
const STATIC_LAST_MODIFIED = new Date("2026-01-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productHandles, collections] = await Promise.all([
    getAllProductHandles(),
    getCollections(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/products/totem`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const policyRoutes: MetadataRoute.Sitemap = POLICY_HANDLES.map((handle) => ({
    url: `${SITE_URL}/policies/${handle}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  // Dynamic routes — no lastModified since updatedAt is not in the current query shape
  const collectionRoutes: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${SITE_URL}/collections/${collection.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const productRoutes: MetadataRoute.Sitemap = productHandles.map(
    ({ handle }) => ({
      url: `${SITE_URL}/products/${handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  return [
    ...staticRoutes,
    ...policyRoutes,
    ...collectionRoutes,
    ...productRoutes,
  ];
}

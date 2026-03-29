import type { MetadataRoute } from 'next'

// Must be set in Vercel env vars — fallback is canonical domain
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studiofile.fr'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

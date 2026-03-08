import type { Metadata } from 'next'
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types'
import { truncate } from '@/lib/utils/format'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studiofile.com'
const TWITTER_HANDLE = '@studiofile'

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s — Studiofile',
    default: 'Studiofile — Premium 3D-Printed Objects',
  },
  description: 'Modular, functional home decor and furniture. Designed in Paris, printed to order.',
  robots: { index: true, follow: true },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
}

export function buildProductMetadata(product: ShopifyProduct): Metadata {
  const description = truncate(product.description, 155)
  const canonical = `${SITE_URL}/products/${product.handle}`

  const images = product.featuredImage
    ? [{
        url: product.featuredImage.url,
        width: product.featuredImage.width ?? 1200,
        height: product.featuredImage.height ?? 630,
        alt: product.featuredImage.altText ?? product.title,
      }]
    : []

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: images.map(i => i.url),
    },
  }
}

export function buildCollectionMetadata(collection: ShopifyCollection): Metadata {
  const description = truncate(collection.description || collection.title, 155)
  const canonical = `${SITE_URL}/collections/${collection.handle}`

  const images = collection.image
    ? [{
        url: collection.image.url,
        width: collection.image.width ?? 1200,
        height: collection.image.height ?? 630,
        alt: collection.image.altText ?? collection.title,
      }]
    : []

  return {
    title: collection.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: collection.title,
      description,
      url: canonical,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.title,
      description,
    },
  }
}

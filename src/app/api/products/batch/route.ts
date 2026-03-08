import { getProduct } from '@/lib/shopify/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handles = searchParams.get('handles')?.split(',').filter(Boolean) ?? []

  if (handles.length === 0) {
    return Response.json([])
  }

  // Fetch in parallel, filter nulls
  const products = await Promise.all(handles.map(h => getProduct(h)))
  return Response.json(products.filter(Boolean))
}

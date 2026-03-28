import { getProduct } from '@/lib/shopify/products'

const MAX_HANDLES = 20

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handles = searchParams.get('handles')?.split(',').filter(Boolean) ?? []

  if (handles.length === 0) {
    return Response.json([])
  }

  if (handles.length > MAX_HANDLES) {
    return Response.json({ error: 'Too many handles' }, { status: 400 })
  }

  try {
    const products = await Promise.all(handles.map(h => getProduct(h)))
    return Response.json(products.filter(Boolean))
  } catch {
    return Response.json([], { status: 500 })
  }
}

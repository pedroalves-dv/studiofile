import { predictiveSearch } from '@/lib/shopify/search'

const EMPTY = { products: [], collections: [], queries: [], pages: [], articles: [] }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return Response.json(EMPTY)
  }

  try {
    const results = await predictiveSearch(query)
    return Response.json(results)
  } catch (error) {
    console.error('Predictive search error:', error)
    return Response.json(EMPTY)
  }
}

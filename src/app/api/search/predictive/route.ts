import { NextRequest, NextResponse } from 'next/server';
import { predictiveSearch } from '@/lib/shopify/search';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ products: [], collections: [], queries: [] });
  }

  try {
    const results = await predictiveSearch(q, 10);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { products: [], collections: [], queries: [] },
      { status: 500 }
    );
  }
}

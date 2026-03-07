import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/shopify/search';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') ?? '';
  const after = searchParams.get('cursor') ?? undefined;
  const sort = searchParams.get('sort') ?? 'RELEVANCE';
  const filterParam = searchParams.getAll('filter');

  if (!q.trim()) {
    return NextResponse.json({ products: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null }, totalCount: 0 });
  }

  // Build filter query string for Shopify search syntax
  const filterClauses = filterParam
    .map((f) => {
      if (f === 'availability:in-stock') return 'available_for_sale:true';
      if (f.startsWith('type:')) return `product_type:${f.slice(5)}`;
      if (f.startsWith('tag:')) return `tag:${f.slice(4)}`;
      return null;
    })
    .filter(Boolean);

  const fullQuery = [q, ...filterClauses].join(' AND ');

  let sortKey: 'RELEVANCE' | 'PRICE' | 'BEST_SELLING' | 'CREATED' = 'RELEVANCE';
  let reverse = false;

  if (sort === 'PRICE_ASC') { sortKey = 'PRICE'; reverse = false; }
  else if (sort === 'PRICE_DESC') { sortKey = 'PRICE'; reverse = true; }
  else if (sort === 'BEST_SELLING') { sortKey = 'BEST_SELLING'; }
  else if (sort === 'CREATED') { sortKey = 'CREATED'; }

  try {
    const result = await searchProducts(fullQuery, { first: 24, after, sortKey, reverse });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ products: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null }, totalCount: 0 }, { status: 500 });
  }
}

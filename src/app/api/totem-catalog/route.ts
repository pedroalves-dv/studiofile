import { NextResponse } from 'next/server';
import { getTotemShapes, getTotemFixtures, getTotemCables } from '@/lib/shopify/totem-catalog';

export async function GET() {
  try {
    const [shapes, fixtures, cables] = await Promise.all([
      getTotemShapes(),
      getTotemFixtures(),
      getTotemCables(),
    ]);
    return NextResponse.json({ shapes, fixtures, cables });
  } catch (error) {
    console.error('[api/totem-catalog] Unexpected error:', error);
    return NextResponse.json({ shapes: [], fixtures: [], cables: [] }, { status: 500 });
  }
}

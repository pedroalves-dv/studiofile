import { NextResponse } from 'next/server';
import { getTotemShapes, getTotemFixations, getTotemCables } from '@/lib/shopify/totem-catalog';

export async function GET() {
  try {
    const [shapes, fixations, cables] = await Promise.all([
      getTotemShapes(),
      getTotemFixations(),
      getTotemCables(),
    ]);
    return NextResponse.json({ shapes, fixations, cables });
  } catch (error) {
    console.error('[api/totem-catalog] Unexpected error:', error);
    return NextResponse.json({ shapes: [], fixations: [], cables: [] }, { status: 500 });
  }
}

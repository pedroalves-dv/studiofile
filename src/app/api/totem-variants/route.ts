import { NextResponse } from 'next/server';
import { getShapeAndFixationVariantMap, getCableVariantMap } from '@/lib/shopify/totem-variants';

export async function GET() {
  try {
    const [shapes, cables] = await Promise.all([
      getShapeAndFixationVariantMap(),
      getCableVariantMap(),
    ]);
    return NextResponse.json({ shapes, cables });
  } catch (error) {
    console.error('[api/totem-variants] Unexpected error:', error);
    return NextResponse.json({ shapes: {}, cables: {} }, { status: 500 });
  }
}

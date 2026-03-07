import { ImageResponse } from 'next/og';
import { getProduct } from '@/lib/shopify/products';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  try {
    const product = await getProduct(handle);

    if (!product) {
      throw new Error('Product not found');
    }

    const imageUrl = product.images[0]?.url;
    const title = product.title;
    const price = product.priceRange.minVariantPrice.amount;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAF7F2',
            color: '#1A1917',
            fontFamily: 'serif',
            padding: '60px',
            gap: '60px',
          }}
        >
          {/* Left side - Title and price */}
          <div
            style={{
              flex: '0 0 40%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '30px',
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 300,
                letterSpacing: '0.05em',
                color: '#6B6561',
              }}
            >
              ${price}
            </div>
          </div>

          {/* Right side - Product image */}
          {imageUrl && (
            <div
              style={{
                flex: '0 0 60%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#E5DFD7',
                aspectRatio: '1',
              }}
            >
              <img
                src={imageUrl}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    // Fallback to default OG image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAF7F2',
            color: '#1A1917',
            fontFamily: 'serif',
            padding: '60px',
            gap: '40px',
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              textAlign: 'center',
            }}
          >
            STUDIOFILE
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 300,
              letterSpacing: '0.05em',
              color: '#6B6561',
            }}
          >
            premium modular furniture
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}

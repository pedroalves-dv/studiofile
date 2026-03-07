import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
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
        {/* Decorative top rule */}
        <div
          style={{
            width: '100px',
            height: '1px',
            background: '#1A1917',
          }}
        />

        {/* Main wordmark */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          STUDIOFILE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: '0.05em',
            textAlign: 'center',
            color: '#6B6561',
            maxWidth: '900px',
          }}
        >
          premium modular furniture & design
        </div>

        {/* Decorative bottom rule */}
        <div
          style={{
            width: '100px',
            height: '1px',
            background: '#1A1917',
            marginTop: '20px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}

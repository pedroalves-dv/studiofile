import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A1917',
          color: '#FAF7F2',
          fontSize: 80,
          fontWeight: 600,
          fontFamily: 'serif',
          letterSpacing: '-0.02em',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}

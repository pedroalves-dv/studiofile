'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'var(--font-body), system-ui, sans-serif',
        backgroundColor: '#FAF5F0',
        color: '#31302e',
        margin: 0,
        padding: 0,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            marginTop: 0,
          }}>
            Application Error
          </h1>
          <p style={{
            fontSize: '16px',
            marginBottom: '32px',
            color: '#6B6560',
            maxWidth: '400px',
          }}>
            An unexpected error occurred. Please try to reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
              backgroundColor: '#31302e',
              color: '#FAF5F0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

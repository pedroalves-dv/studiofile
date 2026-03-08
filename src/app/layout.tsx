import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CookieConsent } from '@/components/common/CookieConsent';
import { LoadingBar } from '@/components/common/LoadingBar';
import { ToastProvider } from '@/components/common/Toast';

import './globals.css';

/* Google Fonts */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s — Studiofile',
    default: 'Studiofile | Premium 3D Printed Furniture',
  },
  description: 'Modular, functional home decor and furniture by Studiofile. Premium design studio aesthetic.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Studiofile',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Studiofile | Premium 3D Printed Furniture',
    description: 'Modular, functional home decor and furniture by Studiofile.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Studiofile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studiofile | Premium 3D Printed Furniture',
    description: 'Modular, functional home decor and furniture by Studiofile.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain">
        {/* Skip to content link */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        {/* Context Providers */}
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              {/* Layout */}
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
              <CartDrawer />

              {/* Common components */}
              <CookieConsent />
              <Suspense fallback={null}>
                <LoadingBar />
              </Suspense>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>

        {/* Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

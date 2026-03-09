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
import { WishlistDrawer } from '@/components/wishlist/WishlistDrawer';
import { CookieConsent } from '@/components/common/CookieConsent';
import { ToastProvider } from '@/components/common/Toast';
import { DEFAULT_METADATA, SITE_URL } from '@/lib/utils/seo';

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
  ...DEFAULT_METADATA,
  manifest: '/manifest.json',
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
      <body className="grain relative">
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
              <main id="main-content" className="flex flex-col min-h-full">{children}</main>
              <Footer />
              <CartDrawer />
              <WishlistDrawer />

              {/* Common components */}
              <CookieConsent />
              <Suspense fallback={null}>
    
              </Suspense>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>

          {/* JSON-LD — WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Studiofile',
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* JSON-LD — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Studiofile',
              url: SITE_URL,
              logo: `${SITE_URL}/icon.png`,
              sameAs: [
                'https://instagram.com/studiofile',
                'https://pinterest.com/studiofile',
              ],
            }),
          }}
        />

        {/* Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

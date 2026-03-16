// 1. Next.js built-ins
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";

// 2. Fonts (next/font + font packages)
import {
  JetBrains_Mono,
  Instrument_Sans,
  Instrument_Serif,
  Inter_Tight,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// 3. Third-party libraries
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LazyMotion, domAnimation } from "motion/react";

// 4. Internal aliases (@/)  — grouped by type
import { DEFAULT_METADATA, SITE_URL } from "@/lib/utils/seo";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/components/common/Toast";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { CookieConsent } from "@/components/common/CookieConsent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterBackground } from "@/components/layout/FooterBackground";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";

// 5. Styles — always last
import "./globals.css";

/* Google Fonts */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400", // only weight available
  style: ["normal", "italic"], // gets you both variants in one import
  variable: "--font-instrument-serif",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  // no weight needed — it's variable
});

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${GeistSans.variable} ${GeistMono.variable} ${interTight.variable}`}
    >
      <body className="grain relative bg-canvas">
        <SmoothScroll>
          <LazyMotion features={domAnimation}>
            <ScrollToTop />
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
                  <main id="main-content" className="flex flex-col min-h-full">
                    {children}
                  </main>
                  <div className="relative w-full">
                    <Footer />
                  </div>
                  <CartDrawer />
                  <WishlistDrawer />

                  {/* Common components */}
                  <CookieConsent />
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>

            {/* JSON-LD — WebSite */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "Studiofile",
                  url: SITE_URL,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                }),
              }}
            />

            {/* JSON-LD — Organization */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Studiofile",
                  url: SITE_URL,
                  logo: `${SITE_URL}/icon.png`,
                  sameAs: [
                    "https://instagram.com/studiofile",
                    "https://pinterest.com/studiofile",
                  ],
                }),
              }}
            />

            {/* Analytics */}
            <Analytics />
            <SpeedInsights />
          </LazyMotion>
        </SmoothScroll>
      </body>
    </html>
  );
}

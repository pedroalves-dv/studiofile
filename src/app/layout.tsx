// 1. Next.js built-ins
import type { Metadata } from "next";
import { ReactNode } from "react";

// 2. Fonts (next/font + font packages)
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// 3. Third-party libraries
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 4. Internal aliases (@/)
import { DEFAULT_METADATA, SITE_URL } from "@/lib/utils/seo";

// 5. Styles — always last
import "./globals.css";

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="grain relative bg-canvas">
        {children}

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
      </body>
    </html>
  );
}

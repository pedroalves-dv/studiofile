import { ReactNode } from "react";
import { getCustomerToken } from "@/lib/shopify/auth";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/components/common/Toast";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { CookieConsent } from "@/components/common/CookieConsent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { FooterBackground } from "@/components/layout/FooterBackground";
import { ScrollSnapProvider } from "@/components/common/ScrollSnapProvider";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getCustomerToken();
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <SmoothScroll>
            <ScrollSnapProvider>
              {/* 1. Keep the Header outside the main flow if it's fixed/sticky */}
              <Header isLoggedIn={!!token} />
              {/* 2. This is the ONLY <main> tag.*/}
              <main
                id="main-content"
                className="relative flex flex-col min-h-screen"
              >
                <div className="flex-1">{children}</div>
                <FooterBackground />
                <Footer />
              </main>

              {/* The Performance-Blur Layer */}
              <div
                id="blur-overlay"
                className="fixed inset-0 z-[40] opacity-0 pointer-events-none transition-opacity duration-300 bg-canvas/30"
                style={{ backdropFilter: "blur(8px)" }}
              />
              {/* 3. Drawers are portals/fixed, so they stay outside */}
              <CartDrawer />
              <WishlistDrawer />
              <CookieConsent />
            </ScrollSnapProvider>
          </SmoothScroll>
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

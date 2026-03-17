import { ReactNode } from "react";
import { getCustomerToken } from "@/lib/shopify/auth";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/components/common/Toast";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { CookieConsent } from "@/components/common/CookieConsent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const token = await getCustomerToken();
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <SmoothScroll>
            <ScrollToTop />
            {/* Skip to content link */}
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>

            <Header isLoggedIn={!!token} />
            <main id="main-content" className="flex flex-col min-h-full">
              {children}
            </main>
            <div className="relative w-full">
              <Footer />
            </div>
            <CartDrawer />
            <WishlistDrawer />

            <CookieConsent />
          </SmoothScroll>
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

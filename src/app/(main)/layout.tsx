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
            {/* Skip to content link */}
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>

            <Header isLoggedIn={!!token} />
            <main id="main-content" className="flex flex-col">
              {children}
            </main>

            <Footer />

            <CartDrawer />
            <WishlistDrawer />

            <CookieConsent />
          </SmoothScroll>
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

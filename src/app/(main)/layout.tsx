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
              {/* 2. Wrap EVERYTHING that scrolls in a single relative container */}
              <div className="relative flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>

                <FooterBackground />
                <Footer />
              </div>

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

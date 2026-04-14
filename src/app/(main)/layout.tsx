import { ReactNode } from "react";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
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

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getCustomerToken();
  const customer = token ? await getCustomer(token) : null;
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <SmoothScroll>
            {/* 1. Keep the Header outside the main flow if it's fixed/sticky */}
            <Header isLoggedIn={!!customer} customer={customer} />
            {/* 2. This is the ONLY <main> tag.*/}
            <main
              id="main-content"
              className="relative flex flex-col min-h-screen"
            >
              <div className="flex-1">{children}</div>
              <FooterBackground />
              <Footer />
            </main>
            {/* 3. Drawers are portals/fixed, so they stay outside */}
            <CartDrawer />
            <WishlistDrawer />
            <CookieConsent />
          </SmoothScroll>
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

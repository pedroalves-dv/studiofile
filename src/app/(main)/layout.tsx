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
            <Header isLoggedIn={!!token} />
            <div className=""> {children}</div>
            <FooterBackground />
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

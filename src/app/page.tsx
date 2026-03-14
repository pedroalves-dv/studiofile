import { Suspense } from "react";
import Image from "next/image";
import { Metadata } from "next";
import { HeroContent } from "@/components/home/HeroContent";
import BrandStory from "@/components/home/BrandStory";

import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import {
  FeaturedProducts,
  FeaturedProductsSkeleton,
} from "@/components/home/FeaturedProducts";

export const metadata: Metadata = {
  title: "3d printing & design studio",
  description:
    "Studiofile: Modular, functional home decor and furniture crafted through 3D printing. Designed in Paris, made to order, shipped worldwide.",
};

// Hero Section
function Hero() {
  return (
    <section className="relative w-full min-h-dvh overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 flex">
        <div className="relative flex-1">
          <Image
            src="/images/hero/totem-3.png"
            alt="TOTEM"
            sizes="(max-width: 768px) 0vw, 50vw"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative flex-1">
          <Image
            src="/images/hero/totem-2.png"
            alt="TOTEM"
            sizes="(max-width: 768px) 0vw, 50vw"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Foreground */}
      <div className="relative z-10 w-full min-h-dvh">
        <HeroContent />
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero />
      {/* Product Spotlight */}
      <ProductSpotlight />

      {/* Featured Products */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* Brand Story */}
      <BrandStory />

      {/* Bottom Hero */}
      {/* <FooterBackground /> */}
    </>
  );
}

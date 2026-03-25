// import { Suspense } from "react";
import { Metadata } from "next";
import { HeroContent } from "@/components/home/HeroContent";
import Image from "next/image";
import BrandStory from "@/components/home/BrandStory";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";

export const metadata: Metadata = {
  title: "3d printing & design studio",
  description:
    "Studiofile: Modular, functional home decor and furniture crafted through 3D printing. Designed in Paris, made to order, shipped worldwide.",
};

// Hero Section
function Hero() {
  return (
    <section className="relative w-full min-h-dvh md:h-[300dvh]">
      {/* Image columns — absolute, decorative, clipped at section boundary */}
      <div aria-hidden="true" className="absolute inset-0 hidden md:flex overflow-hidden">
        {/* Column 1 — md+, no offset */}
        <div className="flex-1 flex flex-col">
          {/* placeholder — swap for next/image */}
          <div className="h-dvh w-full bg-light" />
          <div className="h-dvh w-full bg-lighter" />
          <div className="h-dvh w-full bg-light" />
        </div>
        {/* Column 2 — md+, staggered 50dvh */}
        <div className="flex-1 flex flex-col pt-[50dvh]">
          {/* placeholder — swap for next/image */}
          <div className="h-dvh w-full bg-lighter" />
          <div className="h-dvh w-full bg-light" />
          <div className="h-dvh w-full bg-lighter" />
        </div>
        {/* Column 3 — xl+ only, staggered 100dvh */}
        <div className="hidden xl:flex flex-1 flex-col pt-[100dvh]">
          {/* placeholder — swap for next/image */}
          <div className="h-dvh w-full bg-light" />
          <div className="h-dvh w-full bg-lighter" />
          <div className="h-dvh w-full bg-light" />
        </div>
      </div>

      {/* Mobile fallback background */}
      <div className="absolute inset-0 md:hidden bg-light" />

      {/* Sticky TOTEM — in normal document flow */}
      <div className="sticky top-0 z-10">
        <HeroContent />
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <>
      <Hero />

      <ProductSpotlight />

      <BrandStory />
    </>
  );
}

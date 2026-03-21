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
    <section className="relative w-full min-h-dvh overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 flex">
        <div className="relative flex-1 bg-accent"></div>
        <div className="relative flex-1 bg-tamed"></div>
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
      <Hero />

      <ProductSpotlight />

      <BrandStory />
    </>
  );
}

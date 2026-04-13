// src/app/(main)page.tsx
import { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";

export const metadata: Metadata = {
  title: "3d printing & design studio",
  description:
    "Studio File — Paris 3D printing & design studio. Modular home decor, lighting, and furniture, made to order.",
};

export default async function HomePage() {
  return (
    <>
      <Hero />
      <ProductSpotlight />
      <BrandStory />
    </>
  );
}

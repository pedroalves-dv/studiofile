import { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";

export const metadata: Metadata = {
  title: "3d printing & design studio",
  description: "...",
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

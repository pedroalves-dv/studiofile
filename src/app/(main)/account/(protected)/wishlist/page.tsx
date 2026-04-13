// src/app/(main)/account/(protected)/wishlist/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerToken } from "@/lib/shopify/auth";
import { WishlistPageContent } from "@/components/account/WishlistPageContent";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Wishlist" };
}

export default async function WishlistPage() {
  const token = await getCustomerToken();
  if (!token) redirect("/account/login");
  return <WishlistPageContent />;
}

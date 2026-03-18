import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { SettingsForm } from "./SettingsForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Settings" };
}

export default async function SettingsPage() {
  const token = await getCustomerToken();
  if (!token) redirect("/account/login");

  const customer = await getCustomer(token);
  if (!customer) redirect("/account/login");

  return (
    <main className="bg-canvas min-h-screen">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="mb-12">
          {/* <p className="text-label text-muted mb-2">My Account</p> */}
          <h1 className="font-body font-semibold tracking-tighter text-4xl md:text-5xl text-ink">
            Settings
          </h1>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-8 border-b border-stroke mb-10">
          <Link
            href="/account"
            className="text-label font-body text-muted hover:text-ink transition-colors pb-3"
          >
            Overview
          </Link>
          <Link
            href="/account/orders"
            className="text-label font-body text-muted hover:text-ink transition-colors pb-3"
          >
            Orders
          </Link>
          <span className="text-label font-body text-ink border-b-2 border-ink pb-3">
            Settings
          </span>
          <Link
            href="/account/addresses"
            className="text-label font-body text-muted hover:text-ink transition-colors pb-3"
          >
            Addresses
          </Link>
        </nav>

        <SettingsForm customer={customer} />
      </div>
    </main>
  );
}

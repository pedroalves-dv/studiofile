import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { SettingsForm } from "./SettingsForm";
import { AccountNav } from "@/components/account/AccountNav";

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

        <AccountNav />

        <SettingsForm customer={customer} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { SettingsForm } from "./SettingsForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Settings" };
}

export default async function SettingsPage() {
  const token = await getCustomerToken();
  const customer = await getCustomer(token!);

  return (
    <main className="bg-canvas min-h-screen">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-body font-semibold tracking-tighter text-4xl md:text-5xl text-ink">
            Settings
          </h1>
        </div>

        <SettingsForm customer={customer!} />
      </div>
    </main>
  );
}

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
    <div>
      <section>
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-semibold tracking-tighter text-4xl md:text-5xl text-ink">
            Settings
          </h1>
        </div>
        <div className="border border-stroke rounded-md p-4 mb-12">
          <SettingsForm customer={customer!} />
        </div>
      </section>
    </div>
  );
}

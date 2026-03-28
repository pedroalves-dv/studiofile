import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { getLocalization } from "@/lib/shopify/policies";
import { AddressManager } from "./AddressManager";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Addresses" };
}

export default async function AddressesPage() {
  const token = await getCustomerToken();
  if (!token) redirect('/account/login');
  const [customer, countries] = await Promise.all([
    getCustomer(token),
    getLocalization(),
  ]);
  if (!customer) redirect('/account/login');

  return (
    <main className="bg-canvas">
      <div className="">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tighter text-4xl md:text-5xl text-ink">
            Addresses
          </h1>
        </div>
        <div className="border border-stroke rounded-md p-4 mb-12">
          <AddressManager customer={customer} countries={countries} />
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { AddressManager } from "./AddressManager";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Addresses" };
}

export default async function AddressesPage() {
  const token = await getCustomerToken();
  const customer = await getCustomer(token!);

  return (
    <main className="bg-canvas">
      <div className="">
        <div className="mb-6">
          <h1 className="font-body font-semibold tracking-tighter text-4xl md:text-5xl text-ink">
            Addresses
          </h1>
        </div>
        <div className="border border-stroke rounded-md p-4 mb-12">
          <AddressManager customer={customer!} />
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { OrderCard } from "@/components/account/OrderCard";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Orders" };
}

export default async function OrdersPage() {
  const token = await getCustomerToken();
  if (!token) redirect('/account/login');
  const customer = await getCustomer(token);
  if (!customer) redirect('/account/login');

  const orders = customer.orders.edges.map((e) => e.node);

  return (
    <main className="bg-canvas">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="tracking-tighter font-semibold text-4xl md:text-5xl text-ink">
            Orders
          </h1>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="py-16 text-center border border-stroke rounded-md">
            <p className="text-muted mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <ArrowButton
              href="/shop"
              label="Start shopping"
              className="mt-4 h-12 px-8 py-3 bg-canvas text-ink text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-ink
        justify-center w-fit mx-auto"
            />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-stroke border border-stroke">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

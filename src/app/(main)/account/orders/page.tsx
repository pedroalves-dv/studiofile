import type { Metadata } from "next";
import Link from "next/link";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { OrderCard } from "@/components/account/OrderCard";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Orders" };
}

export default async function OrdersPage() {
  const token = await getCustomerToken();
  const customer = await getCustomer(token!);

  const orders = customer!.orders.edges.map((e) => e.node);

  return (
    <main className="bg-canvas min-h-screen">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-body tracking-tighter font-semibold text-4xl md:text-5xl text-ink">
            Orders
          </h1>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="py-16 text-center border border-stroke">
            <p className="text-muted mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="text-label text-ink hover:text-accent transition-colors"
            >
              Start shopping →
            </Link>
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

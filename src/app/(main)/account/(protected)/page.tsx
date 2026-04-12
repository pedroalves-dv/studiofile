// src/app/(main)/account/(protected)/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { OrderCard } from "@/components/account/OrderCard";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "My Account" };
}

export default async function AccountPage() {
  const token = await getCustomerToken();
  if (!token) redirect("/account/login");
  const customer = await getCustomer(token);
  if (!customer) redirect("/account/login");

  const recentOrders = customer.orders.edges.slice(0, 3).map((e) => e.node);

  return (
    <div className="">
      <section className="">
        <div className="flex items-center justify-between mb-6">
          <h2 className="tracking-tighter font-semibold text-4xl md:text-5xl text-ink">
            Recent orders
          </h2>
          {customer.orders.edges.length > 3 && (
            <Link
              href="/account/orders"
              className="text-label text-muted hover:text-ink transition-colors"
            >
              View all
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted py-12 text-center rounded-md border border-stroke">
            No orders yet.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-stroke border border-stroke">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {customer.orders.edges.length > 3 && (
          <div className="mt-6">
            <Link
              href="/account/orders"
              className="text-label text-ink hover:text-accent transition-colors"
            >
              View all orders →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

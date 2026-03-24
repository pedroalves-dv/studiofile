import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { OrderCard } from "@/components/account/OrderCard";
import { CustomerAvatar } from "@/components/ui/CustomerAvatar";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "My Account" };
}

export default async function AccountPage() {
  const token = await getCustomerToken();

  if (!token) {
    redirect("/account/login");
  }

  const customer = await getCustomer(token);

  if (!customer) redirect("/account/login");

  const recentOrders = customer.orders.edges.slice(0, 3).map((e) => e.node);

  return (
    <main className="bg-canvas ">
      <div className="px-5 section-height pt-[var(--header-height)] pb-12 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Header */}
        <div className="">
          <div className="mb-4 pb-8 border-b border-ink -mx-5 px-5">
            {/* <p className="text-label font-body text-muted mb-2">My Account</p> */}
            <h1 className="">
              <CustomerAvatar
                firstName={customer.firstName}
                lastName={customer.lastName}
                email={customer.email}
              />
            </h1>
          </div>

          {/* Nav tabs */}
          <nav className="flex justify-between border-b border-stroke mb-10 -mx-5 px-5">
            <span className="text-lg tracking-[-0.04em] font-body text-ink border-b-4 border-ink pb-2">
              Overview
            </span>
            <Link
              href="/account/orders"
              className="text-lg tracking-[-0.04em] text-light font-body hover:text-ink transition-colors pb-3"
            >
              Orders
            </Link>
            <Link
              href="/account/settings"
              className="text-lg tracking-[-0.04em] text-light font-body hover:text-ink transition-colors pb-3"
            >
              Settings
            </Link>
            <Link
              href="/account/addresses"
              className="text-lg tracking-[-0.04em] text-light font-body hover:text-ink transition-colors pb-3"
            >
              Addresses
            </Link>
          </nav>
        </div>
        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-body font-regular tracking-[-0.04em] text-2xl text-ink">
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
            <p className="text-sm text-muted py-12 text-center border border-stroke">
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
    </main>
  );
}

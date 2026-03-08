import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCustomerToken, getCustomer, customerLogout } from '@/lib/shopify/auth'
import { OrderCard } from '@/components/account/OrderCard'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'My Account' }
}

export default async function AccountPage() {
  const token = await getCustomerToken()

  if (!token) {
    redirect('/account/login')
  }

  const customer = await getCustomer(token)

  if (!customer) {
    // Token exists but is expired/invalid — clear it and redirect
    ;(await cookies()).delete('sf-customer-token')
    redirect('/account/login')
  }

  const recentOrders = customer.orders.edges.slice(0, 3).map(e => e.node)

  return (
    <main className="bg-canvas min-h-screen">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-label text-muted mb-2">My Account</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink">
              Hello, {customer.firstName ?? customer.email}.
            </h1>
          </div>
          <form action={customerLogout}>
            <button
              type="submit"
              aria-label="Sign out"
              className="text-label text-muted hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-8 border-b border-stroke mb-10">
          <span className="text-label text-ink border-b-2 border-ink pb-3">Overview</span>
          <Link
            href="/account/orders"
            className="text-label text-muted hover:text-ink transition-colors pb-3"
          >
            Orders
          </Link>
        </nav>

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-ink">Recent orders</h2>
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
              {recentOrders.map(order => (
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
  )
}

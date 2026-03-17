import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCustomerToken, getCustomer } from '@/lib/shopify/auth'
import { AddressManager } from './AddressManager'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Addresses' }
}

export default async function AddressesPage() {
  const token = await getCustomerToken()
  if (!token) redirect('/account/login')

  const customer = await getCustomer(token)
  if (!customer) redirect('/account/login')

  return (
    <main className="bg-canvas min-h-screen">
      <div className="container-wide section-padding">
        {/* Header */}
        <div className="mb-12">
          <p className="text-label text-muted mb-2">My Account</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink">
            Hello, {customer.firstName ?? customer.email}.
          </h1>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-8 border-b border-stroke mb-10">
          <Link href="/account" className="text-label text-muted hover:text-ink transition-colors pb-3">
            Overview
          </Link>
          <Link href="/account/orders" className="text-label text-muted hover:text-ink transition-colors pb-3">
            Orders
          </Link>
          <Link href="/account/settings" className="text-label text-muted hover:text-ink transition-colors pb-3">
            Settings
          </Link>
          <span className="text-label text-ink border-b-2 border-ink pb-3">Addresses</span>
        </nav>

        <AddressManager customer={customer} />
      </div>
    </main>
  )
}

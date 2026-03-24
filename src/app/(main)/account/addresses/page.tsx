import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCustomerToken, getCustomer } from '@/lib/shopify/auth'
import { AddressManager } from './AddressManager'
import { AccountNav } from '@/components/account/AccountNav'

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

        <AccountNav />

        <AddressManager customer={customer} />
      </div>
    </main>
  )
}

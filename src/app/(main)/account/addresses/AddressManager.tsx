'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  customerAddressCreate,
  customerAddressUpdate,
  customerAddressDelete,
  customerDefaultAddressUpdate,
} from '@/lib/shopify/auth'
import type { ShopifyCustomer, ShopifyAddress } from '@/lib/shopify/types'
import type { AddressInput } from '@/lib/shopify/auth'

interface Props {
  customer: ShopifyCustomer
}

type Mode = 'list' | 'add' | { edit: ShopifyAddress }

const inputClass =
  'w-full border border-stroke bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50'

const labelClass = 'text-label text-muted'

// ─── Address form (add / edit) ─────────────────────────────────────────────

interface AddressFormProps {
  initial?: ShopifyAddress
  isPending: boolean
  onSubmit: (address: AddressInput) => void
  onCancel: () => void
  submitLabel: string
}

function AddressForm({ initial, isPending, onSubmit, onCancel, submitLabel }: AddressFormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? '')
  const [lastName, setLastName] = useState(initial?.lastName ?? '')
  const [address1, setAddress1] = useState(initial?.address1 ?? '')
  const [address2, setAddress2] = useState(initial?.address2 ?? '')
  const [city, setCity] = useState(initial?.city ?? '')
  const [province, setProvince] = useState(initial?.province ?? '')
  const [zip, setZip] = useState(initial?.zip ?? '')
  const [country, setCountry] = useState(initial?.country ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ firstName, lastName, address1, address2, city, province, zip, country })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-firstName" className={labelClass}>First name</label>
          <input
            id="addr-firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-lastName" className={labelClass}>Last name</label>
          <input
            id="addr-lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="addr-address1" className={labelClass}>Address line 1</label>
        <input
          id="addr-address1"
          type="text"
          required
          autoComplete="address-line1"
          value={address1}
          onChange={e => setAddress1(e.target.value)}
          disabled={isPending}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="addr-address2" className={labelClass}>Address line 2 <span className="text-muted/50">(optional)</span></label>
        <input
          id="addr-address2"
          type="text"
          autoComplete="address-line2"
          value={address2}
          onChange={e => setAddress2(e.target.value)}
          disabled={isPending}
          className={inputClass}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-city" className={labelClass}>City</label>
          <input
            id="addr-city"
            type="text"
            required
            autoComplete="address-level2"
            value={city}
            onChange={e => setCity(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-province" className={labelClass}>Province / State</label>
          <input
            id="addr-province"
            type="text"
            autoComplete="address-level1"
            value={province}
            onChange={e => setProvince(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-zip" className={labelClass}>ZIP / Postcode</label>
          <input
            id="addr-zip"
            type="text"
            autoComplete="postal-code"
            value={zip}
            onChange={e => setZip(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-country" className={labelClass}>Country</label>
          <input
            id="addr-country"
            type="text"
            required
            autoComplete="country-name"
            value={country}
            onChange={e => setCountry(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-ink text-canvas py-3 px-8 text-label hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onCancel}
          className="border border-stroke text-ink py-3 px-8 text-label hover:bg-stroke/20 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export function AddressManager({ customer }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('list')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addresses = customer.addresses.edges.map(e => e.node)
  const defaultId = customer.defaultAddress?.id ?? null

  function clearBanners() {
    setError(null)
    setSuccess(null)
  }

  function afterSuccess(msg: string) {
    setSuccess(msg)
    setMode('list')
    router.refresh()
  }

  function handleCreate(address: AddressInput) {
    clearBanners()
    startTransition(async () => {
      const result = await customerAddressCreate(address)
      if (result.success) {
        afterSuccess('Address added.')
      } else {
        setError(result.error ?? 'Failed to add address')
      }
    })
  }

  function handleUpdate(addressId: string, address: AddressInput) {
    clearBanners()
    startTransition(async () => {
      const result = await customerAddressUpdate(addressId, address)
      if (result.success) {
        afterSuccess('Address updated.')
      } else {
        setError(result.error ?? 'Failed to update address')
      }
    })
  }

  function handleDelete(addressId: string) {
    clearBanners()
    startTransition(async () => {
      const result = await customerAddressDelete(addressId)
      if (result.success) {
        afterSuccess('Address removed.')
      } else {
        setError(result.error ?? 'Failed to delete address')
      }
    })
  }

  function handleSetDefault(addressId: string) {
    clearBanners()
    startTransition(async () => {
      const result = await customerDefaultAddressUpdate(addressId)
      if (result.success) {
        afterSuccess('Default address updated.')
      } else {
        setError(result.error ?? 'Failed to update default address')
      }
    })
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-ink">Addresses</h2>
        {mode === 'list' && (
          <button
            onClick={() => { clearBanners(); setMode('add') }}
            disabled={isPending}
            className="text-label text-muted hover:text-ink transition-colors disabled:opacity-50"
          >
            + Add new address
          </button>
        )}
      </div>

      {/* Banners */}
      {error && (
        <p className="text-sm text-error border border-error/30 bg-error/5 px-4 py-3 mb-6">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-success border border-success/30 bg-success/5 px-4 py-3 mb-6">
          {success}
        </p>
      )}

      {/* Add form */}
      {mode === 'add' && (
        <div className="mb-8">
          <h3 className="font-display text-lg text-ink mb-5">New address</h3>
          <AddressForm
            isPending={isPending}
            onSubmit={handleCreate}
            onCancel={() => { clearBanners(); setMode('list') }}
            submitLabel="Save address"
          />
        </div>
      )}

      {/* Address list */}
      {mode !== 'add' && addresses.length === 0 && (
        <p className="text-sm text-muted py-12 text-center border border-stroke">
          No addresses saved.
        </p>
      )}

      {addresses.length > 0 && (
        <div className="divide-y divide-stroke border border-stroke">
          {addresses.map(address => {
            const isDefault = address.id === defaultId
            const isEditing = typeof mode === 'object' && mode.edit.id === address.id

            return (
              <div key={address.id} className="p-6">
                {isEditing ? (
                  <>
                    <h3 className="font-display text-lg text-ink mb-5">Edit address</h3>
                    <AddressForm
                      initial={address}
                      isPending={isPending}
                      onSubmit={addr => handleUpdate(address.id, addr)}
                      onCancel={() => { clearBanners(); setMode('list') }}
                      submitLabel="Save changes"
                    />
                  </>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Address details */}
                    <div className="flex flex-col gap-1">
                      {isDefault && (
                        <span className="text-label text-xs bg-accent text-ink px-2 py-0.5 self-start mb-1">
                          Default
                        </span>
                      )}
                      {(address.firstName || address.lastName) && (
                        <p className="text-sm text-ink font-medium">
                          {[address.firstName, address.lastName].filter(Boolean).join(' ')}
                        </p>
                      )}
                      <p className="text-sm text-muted">{address.address1}</p>
                      {address.address2 && (
                        <p className="text-sm text-muted">{address.address2}</p>
                      )}
                      <p className="text-sm text-muted">
                        {[address.city, address.province, address.zip].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-sm text-muted">{address.country}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-5 shrink-0">
                      <button
                        onClick={() => { clearBanners(); setMode({ edit: address }) }}
                        disabled={isPending}
                        className="text-label text-muted hover:text-ink transition-colors disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        disabled={isPending}
                        className="text-label text-error hover:text-error/70 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                      {!isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          disabled={isPending}
                          className="text-label text-muted hover:text-ink transition-colors disabled:opacity-50"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

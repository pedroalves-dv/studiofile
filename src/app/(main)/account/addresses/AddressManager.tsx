"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  customerAddressCreate,
  customerAddressUpdate,
  customerAddressDelete,
  customerDefaultAddressUpdate,
} from "@/lib/shopify/auth";
import type { ShopifyCustomer, ShopifyAddress } from "@/lib/shopify/types";
import type { AddressInput } from "@/lib/shopify/auth";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useToast } from "@/components/common/Toast";

interface Props {
  customer: ShopifyCustomer;
}

type Mode = "list" | "add" | { edit: ShopifyAddress };

const inputClass =
  "w-full border border-stroke bg-canvas rounded-md px-4 py-3 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50";

const labelClass = "font-body text-light text-base tracking-tight";

interface AddressFormProps {
  initial?: ShopifyAddress;
  isPending: boolean;
  onSubmit: (address: AddressInput) => void;
  onCancel: () => void;
  submitLabel: string;
}

function AddressForm({
  initial,
  isPending,
  onSubmit,
  onCancel,
  submitLabel,
}: AddressFormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [address1, setAddress1] = useState(initial?.address1 ?? "");
  const [address2, setAddress2] = useState(initial?.address2 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [province, setProvince] = useState(initial?.province ?? "");
  const [zip, setZip] = useState(initial?.zip ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      address1,
      address2,
      city,
      province,
      zip,
      country,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-firstName" className={labelClass}>
            First name
          </label>
          <input
            id="addr-firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-lastName" className={labelClass}>
            Last name
          </label>
          <input
            id="addr-lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="addr-address1" className={labelClass}>
          Address line 1
        </label>
        <input
          id="addr-address1"
          type="text"
          required
          autoComplete="address-line1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          disabled={isPending}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="addr-address2" className={labelClass}>
          Address line 2 <span className="text-muted/50">(optional)</span>
        </label>
        <input
          id="addr-address2"
          type="text"
          autoComplete="address-line2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          disabled={isPending}
          className={inputClass}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-city" className={labelClass}>
            City
          </label>
          <input
            id="addr-city"
            type="text"
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-province" className={labelClass}>
            Province / State
          </label>
          <input
            id="addr-province"
            type="text"
            autoComplete="address-level1"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-zip" className={labelClass}>
            ZIP / Postcode
          </label>
          <input
            id="addr-zip"
            type="text"
            autoComplete="postal-code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="addr-country" className={labelClass}>
            Country
          </label>
          <input
            id="addr-country"
            type="text"
            required
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <ArrowButton
          type="submit"
          disabled={isPending}
          label={isPending ? "Saving…" : submitLabel}
          className="px-6 py-2 bg-canvas text-ink text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-ink justify-center w-fit disabled:opacity-50"
        />
        <ArrowButton
          type="button"
          disabled={isPending}
          onClick={onCancel}
          label="Cancel"
          showArrow={false}
          className="px-6 py-2 bg-canvas text-light text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-stroke justify-center w-fit disabled:opacity-50 hover:text-ink hover:border-ink transition-colors"
        />
      </div>
    </form>
  );
}

export function AddressManager({ customer }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("list");
  const [isPending, startTransition] = useTransition();

  const addresses = customer.addresses.edges.map((e) => e.node);
  const defaultId = customer.defaultAddress?.id ?? null;

  function afterSuccess(msg: string) {
    toast.success(msg);
    setMode("list");
    router.refresh();
  }

  function handleCreate(address: AddressInput) {
    startTransition(async () => {
      const result = await customerAddressCreate(address);
      if (result.success) afterSuccess("Address added.");
      else toast.error(result.error ?? "Failed to add address");
    });
  }

  function handleUpdate(addressId: string, address: AddressInput) {
    startTransition(async () => {
      const result = await customerAddressUpdate(addressId, address);
      if (result.success) afterSuccess("Address updated.");
      else toast.error(result.error ?? "Failed to update address");
    });
  }

  function handleDelete(addressId: string) {
    startTransition(async () => {
      const result = await customerAddressDelete(addressId);
      if (result.success) afterSuccess("Address removed.");
      else toast.error(result.error ?? "Failed to delete address");
    });
  }

  function handleSetDefault(addressId: string) {
    startTransition(async () => {
      const result = await customerDefaultAddressUpdate(addressId);
      if (result.success) afterSuccess("Default address updated.");
      else toast.error(result.error ?? "Failed to update default address");
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-body tracking-tighter font-medium text-2xl text-light">
          Saved addresses
        </h2>
        {mode === "list" && (
          <button
            onClick={() => setMode("add")}
            disabled={isPending}
            className="text-base font-medium tracking-[-0.04em] font-body text-light hover:text-ink transition-colors disabled:opacity-50"
          >
            + Add new
          </button>
        )}
      </div>

      {mode === "add" && (
        <div className="mb-8">
          <h3 className="font-body font-medium tracking-tighter text-xl text-ink mb-5">
            New address
          </h3>
          <AddressForm
            isPending={isPending}
            onSubmit={handleCreate}
            onCancel={() => setMode("list")}
            submitLabel="Save address"
          />
        </div>
      )}

      {mode !== "add" && addresses.length === 0 && (
        <p className="text-sm text-muted py-12 text-center border border-stroke rounded-md">
          No addresses saved.
        </p>
      )}

      {addresses.length > 0 && (
        <div className="divide-y divide-stroke border border-stroke rounded-md">
          {addresses.map((address) => {
            const isDefault = address.id === defaultId;
            const isEditing =
              typeof mode === "object" && mode.edit.id === address.id;

            return (
              <div key={address.id} className="p-6">
                {isEditing ? (
                  <>
                    <h3 className="font-body font-medium tracking-tighter text-xl text-ink mb-5">
                      Edit address
                    </h3>
                    <AddressForm
                      initial={address}
                      isPending={isPending}
                      onSubmit={(addr) => handleUpdate(address.id, addr)}
                      onCancel={() => setMode("list")}
                      submitLabel="Save changes"
                    />
                  </>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1">
                      {isDefault && (
                        <span className="text-label text-xs bg-ink text-canvas px-2 py-0.5 self-start mb-1 rounded-sm">
                          Default
                        </span>
                      )}
                      {(address.firstName || address.lastName) && (
                        <p className="font-body text-base font-medium tracking-tight text-ink">
                          {[address.firstName, address.lastName]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                      )}
                      <p className="font-body text-sm text-muted">
                        {address.address1}
                      </p>
                      {address.address2 && (
                        <p className="font-body text-sm text-muted">
                          {address.address2}
                        </p>
                      )}
                      <p className="font-body text-sm text-muted">
                        {[address.city, address.province, address.zip]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="font-body text-sm text-muted">
                        {address.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 shrink-0">
                      <button
                        onClick={() => setMode({ edit: address })}
                        disabled={isPending}
                        className="font-body text-base tracking-[-0.04em] text-light hover:text-ink transition-colors disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        disabled={isPending}
                        className="font-body text-base tracking-[-0.04em] text-error hover:text-error/70 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                      {!isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          disabled={isPending}
                          className="font-body text-base tracking-[-0.04em] text-light hover:text-ink transition-colors disabled:opacity-50"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
import { isValidPhoneNumber } from "libphonenumber-js/min";
import type { CountryCode } from "libphonenumber-js/min";
import type { LocalizationCountry } from "@/lib/shopify/types";

type FormErrors = Partial<Record<keyof AddressInput, string>>;

interface Props {
  customer: ShopifyCustomer;
  countries: LocalizationCountry[];
}

type Mode = "list" | "add" | { edit: ShopifyAddress };

const inputClass =
  "w-full border border-stroke bg-canvas rounded-md px-4 py-3 text-base text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50";

const selectClass =
  "w-full border border-stroke bg-canvas rounded-md px-4 py-3 text-base text-ink focus:outline-none focus:border-ink transition-colors disabled:opacity-50 appearance-none cursor-pointer";

const labelClass = "font-body text-light text-base tracking-tight";

function lookupCountryName(code: string, countries: LocalizationCountry[]): string {
  return countries.find((c) => c.isoCode === code)?.name ?? code;
}

function lookupProvinceName(
  provinceCode: string,
  countryCode: string,
  countries: LocalizationCountry[]
): string {
  const country = countries.find((c) => c.isoCode === countryCode);
  return country?.provinces.find((p) => p.code === provinceCode)?.name ?? provinceCode;
}

function findCountryCode(name: string, countries: LocalizationCountry[]): string {
  return countries.find((c) => c.name === name)?.isoCode ?? "";
}

function findProvinceCode(
  provinceName: string,
  countryCode: string,
  countries: LocalizationCountry[]
): string {
  const country = countries.find((c) => c.isoCode === countryCode);
  return country?.provinces.find((p) => p.name === provinceName)?.code ?? "";
}

function validateAddress(f: AddressInput, countryCode: string): FormErrors {
  const errors: FormErrors = {};
  if (!f.firstName?.trim()) errors.firstName = "First name is required.";
  if (!f.lastName?.trim()) errors.lastName = "Last name is required.";
  if (!f.address1?.trim()) errors.address1 = "Address is required.";
  else if (f.address1.trim().length < 5) errors.address1 = "Enter a valid address.";
  if (!f.city?.trim()) errors.city = "City is required.";
  if (!f.zip?.trim()) errors.zip = "Postcode is required.";
  if (!f.country?.trim()) errors.country = "Country is required.";
  if (f.phone?.trim()) {
    try {
      if (!isValidPhoneNumber(f.phone.trim(), countryCode as CountryCode)) {
        errors.phone = "Enter a valid phone number for this country.";
      }
    } catch {
      errors.phone = "Enter a valid phone number.";
    }
  }
  return errors;
}

interface AddressFormProps {
  initial?: ShopifyAddress;
  countries: LocalizationCountry[];
  serverErrors?: FormErrors;
  isPending: boolean;
  onSubmit: (address: AddressInput) => void;
  onCancel: () => void;
  submitLabel: string;
}

function AddressForm({
  initial,
  countries,
  serverErrors,
  isPending,
  onSubmit,
  onCancel,
  submitLabel,
}: AddressFormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
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
      phone,
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
        <label htmlFor="addr-phone" className={labelClass}>
          Phone
        </label>
        <input
          id="addr-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isPending}
          className={inputClass}
        />
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

export function AddressManager({ customer, countries }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("list");
  const [formServerErrors, setFormServerErrors] = useState<FormErrors>({});
  const [isFormPending, startFormTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  const addresses = customer.addresses.edges.map((e) => e.node);
  const defaultId = customer.defaultAddress?.id ?? null;

  function handleModeChange(newMode: Mode) {
    setFormServerErrors({});
    setMode(newMode);
  }

  function afterSuccess(msg: string) {
    toast.success(msg);
    setMode("list");
    router.refresh();
  }

  function handleCreate(address: AddressInput) {
    startFormTransition(async () => {
      const result = await customerAddressCreate(address);
      if (result.success) afterSuccess("Address added.");
      else toast.error(result.error ?? "Failed to add address");
    });
  }

  async function handleUpdate(addressId: string, address: AddressInput) {
    setPendingId(addressId);
    const result = await customerAddressUpdate(addressId, address);
    setPendingId(null);
    if (result.success) afterSuccess("Address updated.");
    else toast.error(result.error ?? "Failed to update address");
  }

  async function handleDelete(addressId: string) {
    setConfirmingDeleteId(null);
    setPendingId(addressId);
    const result = await customerAddressDelete(addressId);
    setPendingId(null);
    if (result.success) afterSuccess("Address removed.");
    else toast.error(result.error ?? "Failed to delete address");
  }

  async function handleSetDefault(addressId: string) {
    setPendingId(addressId);
    const result = await customerDefaultAddressUpdate(addressId);
    setPendingId(null);
    if (result.success) afterSuccess("Default address updated.");
    else toast.error(result.error ?? "Failed to update default address");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-body tracking-tighter font-medium text-2xl text-light">
          Saved addresses
        </h2>
        {mode === "list" && (
          <button
            onClick={() => handleModeChange("add")}
            disabled={pendingId !== null}
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
            countries={countries}
            serverErrors={formServerErrors}
            isPending={isFormPending}
            onSubmit={handleCreate}
            onCancel={() => handleModeChange("list")}
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
            const isThisPending = pendingId === address.id;
            const isConfirmingDelete = confirmingDeleteId === address.id;

            return (
              <div key={address.id} className="relative p-6">
                {isEditing ? (
                  <>
                    <h3 className="font-body font-medium tracking-tighter text-xl text-ink mb-5">
                      Edit address
                    </h3>
                    <AddressForm
                      initial={address}
                      countries={countries}
                      serverErrors={formServerErrors}
                      isPending={isThisPending}
                      onSubmit={(addr) => handleUpdate(address.id, addr)}
                      onCancel={() => handleModeChange("list")}
                      submitLabel="Save changes"
                    />
                  </>
                ) : (
                  <div className="">
                    {/* Confirmation overlay */}
                    {isConfirmingDelete && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[rgba(250,245,240,0.95)] rounded-md">
                        <p className="font-body text-base tracking-tight text-ink">
                          Remove this address?
                        </p>
                        <div className="flex gap-3">
                          <ArrowButton
                            type="button"
                            label="Confirm"
                            onClick={() => handleDelete(address.id)}
                            disabled={isThisPending}
                            showArrow={false}
                            className="px-6 py-2 bg-error text-white text-base font-medium tracking-[-0.04em] rounded-md flex items-center justify-center w-fit disabled:opacity-50"
                          />
                          <ArrowButton
                            type="button"
                            label="Cancel"
                            onClick={() => setConfirmingDeleteId(null)}
                            disabled={isThisPending}
                            showArrow={false}
                            className="px-6 py-2 bg-canvas text-light text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-stroke justify-center w-fit hover:text-ink hover:border-ink transition-colors disabled:opacity-50"
                          />
                        </div>
                      </div>
                    )}

                    {/* Card content */}
                    <div
                      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${isConfirmingDelete ? "pointer-events-none select-none" : ""}`}
                    >
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
                        {address.phone && (
                          <p className="font-body text-sm text-muted">
                            {address.phone}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-5 shrink-0">
                        <button
                          onClick={() => handleModeChange({ edit: address })}
                          disabled={isThisPending}
                          className="font-body text-base tracking-[-0.04em] text-light hover:text-ink transition-colors disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(address.id)}
                          disabled={isThisPending}
                          className="font-body text-base tracking-[-0.04em] text-error hover:text-error/70 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                        {!isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            disabled={isThisPending}
                            className="font-body text-base tracking-[-0.04em] text-light hover:text-ink transition-colors disabled:opacity-50"
                          >
                            Set as default
                          </button>
                        )}
                      </div>
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

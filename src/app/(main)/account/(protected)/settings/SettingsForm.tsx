"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  customerUpdateProfile,
  customerUpdatePassword,
} from "@/lib/shopify/auth";
import type { ShopifyCustomer } from "@/lib/shopify/types";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useToast } from "@/components/common/Toast";

interface SettingsFormProps {
  customer: ShopifyCustomer;
}

const inputClass =
  "w-full border border-stroke bg-canvas rounded-md px-4 py-3 text-md text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50";

const labelClass = "text-light text-base tracking-tight";

export function SettingsForm({ customer }: SettingsFormProps) {
  const router = useRouter();
  const toast = useToast();

  const [firstName, setFirstName] = useState(customer.firstName ?? "");
  const [lastName, setLastName] = useState(customer.lastName ?? "");
  const [email, setEmail] = useState(customer.email);
  const [isPendingProfile, startProfileTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPendingPassword, startPasswordTransition] = useTransition();

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    startProfileTransition(async () => {
      const result = await customerUpdateProfile(firstName, lastName, email);
      if (result.success) {
        toast.success("Profile updated.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Update failed");
      }
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    startPasswordTransition(async () => {
      const result = await customerUpdatePassword(
        customer.email,
        currentPassword,
        newPassword,
      );
      if (result.success) {
        toast.success("Password updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error ?? "Password update failed");
      }
    });
  }

  return (
    <div>
      {/* Profile section */}
      <section>
        <h2 className="tracking-tighter font-medium text-2xl text-ink mb-6">
          Profile
        </h2>
        <form
          onSubmit={handleProfileSubmit}
          className="flex flex-col gap-5 max-w-md"
        >
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="firstName" className={labelClass}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isPendingProfile}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 rounded-md">
              <label htmlFor="lastName" className={labelClass}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isPendingProfile}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPendingProfile}
              className={inputClass}
            />
          </div>

          <div>
            <ArrowButton
              type="submit"
              disabled={isPendingProfile}
              label={isPendingProfile ? "Saving…" : "Save profile"}
              className="mt-4 px-6 py-2 bg-canvas text-ink text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-ink justify-center w-fit disabled:opacity-50"
            />
          </div>
        </form>
      </section>

      <hr className="border-stroke my-12" />

      {/* Password section */}
      <section>
        <h2 className="tracking-tighter font-medium text-2xl text-ink mb-6">
          Change password
        </h2>
        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-5 max-w-md"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="currentPassword" className={labelClass}>
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isPendingPassword}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className={labelClass}>
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isPendingPassword}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPendingPassword}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div>
            <ArrowButton
              type="submit"
              disabled={isPendingPassword}
              label={isPendingPassword ? "Updating…" : "Update password"}
              className="mt-4 px-6 py-2 bg-canvas text-ink text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-ink justify-center w-fit disabled:opacity-50"
            />
          </div>
        </form>
      </section>
    </div>
  );
}

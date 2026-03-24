"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  customerUpdateProfile,
  customerUpdatePassword,
} from "@/lib/shopify/auth";
import type { ShopifyCustomer } from "@/lib/shopify/types";

interface SettingsFormProps {
  customer: ShopifyCustomer;
}

const inputClass =
  "w-full border border-stroke bg-canvas rounded-md px-4 py-3 text-md text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50";

const labelClass = "font-body text-muted text-md";

export function SettingsForm({ customer }: SettingsFormProps) {
  const router = useRouter();

  // Profile form state — initialised from server-fetched customer, updated on success
  const [firstName, setFirstName] = useState(customer.firstName ?? "");
  const [lastName, setLastName] = useState(customer.lastName ?? "");
  const [email, setEmail] = useState(customer.email);
  const [isPendingProfile, startProfileTransition] = useTransition();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPendingPassword, startPasswordTransition] = useTransition();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    startProfileTransition(async () => {
      const result = await customerUpdateProfile(firstName, lastName, email);
      if (result.success) {
        setProfileSuccess(true);
        router.refresh();
      } else {
        setProfileError(result.error ?? "Update failed");
      }
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return;
    }

    startPasswordTransition(async () => {
      const result = await customerUpdatePassword(
        customer.email,
        currentPassword,
        newPassword,
      );
      if (result.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.error ?? "Password update failed");
      }
    });
  }

  return (
    <div>
      {/* Profile section */}
      <section>
        <h2 className="font-body tracking-tighter font-medium text-2xl text-ink mb-6">
          Profile
        </h2>
        <form
          onSubmit={handleProfileSubmit}
          className="flex flex-col gap-5 max-w-md"
        >
          {profileError && (
            <p className="text-sm font-body  text-error border border-error/30 bg-error/5 px-4 py-3">
              {profileError}
            </p>
          )}
          {profileSuccess && (
            <p className="text-sm font-body text-success border border-success/30 bg-success/5 px-4 py-3">
              Profile updated.
            </p>
          )}

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
            <button
              type="submit"
              disabled={isPendingProfile}
              className="bg-ink rounded-lg font-body text-xs text-label text-canvas py-3 px-8 hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              {isPendingProfile ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </section>

      <hr className="border-stroke my-12" />

      {/* Password section */}
      <section>
        <h2 className="font-body tracking-tighter font-medium text-2xl text-ink mb-6">
          Change password
        </h2>
        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-5 max-w-md"
        >
          {passwordError && (
            <p className="text-sm font-body text-error border border-error/30 bg-error/5 px-4 py-3">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p className="text-sm font-body text-success border border-success/30 bg-success/5 px-4 py-3">
              Password updated.
            </p>
          )}

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
            <button
              type="submit"
              disabled={isPendingPassword}
              className="bg-ink font-body text-xs rounded-lg text-canvas py-3 px-8 text-label hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              {isPendingPassword ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

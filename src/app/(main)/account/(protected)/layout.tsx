// src/app/(main)/account/(protected)/layout.tsx
import { ReactNode } from "react";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { CustomerAvatar } from "@/components/ui/CustomerAvatar";
import { AccountNav } from "@/components/account/AccountNav";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Middleware already redirects unauthenticated users — no redirect() here.
  // Calling redirect() in a layout during a Server Action POST causes a 500.
  const token = await getCustomerToken();
  const customer = token ? await getCustomer(token) : null;

  return (
    <div className="px-5 pt-12 sm:pt-[var(--header-height)] section-height pb-12">
      <div className="-mx-5 px-5 pb-6 mb-2 border-b border-stroke">
        {customer && (
          <CustomerAvatar
            firstName={customer.firstName}
            lastName={customer.lastName}
            email={customer.email}
          />
        )}
      </div>
      <AccountNav />
      {children}
    </div>
  );
}

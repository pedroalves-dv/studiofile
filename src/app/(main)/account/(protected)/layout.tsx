// src/app/(main)/account/(protected)/layout.tsx
import { ReactNode } from "react";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { CustomerAvatar } from "@/components/account/CustomerAvatar";
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
    <div className="px-5 mt-8 page-pb section-height">
      <AccountNav />
      <div className="-mx-5 px-5 pb-8">
        {customer && (
          <CustomerAvatar
            firstName={customer.firstName}
            lastName={customer.lastName}
            email={customer.email}
          />
        )}
      </div>

      {children}
    </div>
  );
}

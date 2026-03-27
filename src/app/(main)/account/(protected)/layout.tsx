import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCustomerToken, getCustomer } from "@/lib/shopify/auth";
import { CustomerAvatar } from "@/components/ui/CustomerAvatar";
import { AccountNav } from "@/components/account/AccountNav";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getCustomerToken();
  if (!token) redirect("/account/login");

  const customer = await getCustomer(token);
  if (!customer) redirect("/account/login");

  return (
    <div className="px-5 pt-12 sm:pt-[var(--header-height)]">
      <div className="-mx-5 px-5 pb-6 mb-2 border-b border-stroke">
        <CustomerAvatar
          firstName={customer.firstName}
          lastName={customer.lastName}
          email={customer.email}
        />
      </div>
      <AccountNav />
      {children}
    </div>
  );
}

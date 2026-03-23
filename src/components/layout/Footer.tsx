"use client";

import Link from "next/link";
import { SimpleIcon } from "@/components/ui/SimpleIcon";
import { siInstagram, siPinterest, siX, siTiktok } from "simple-icons";
import { useState } from "react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const FOOTER_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/about#process" },
  { label: "Contact", href: "/contact" },
];

const CONDITIONS_POLICIES_LINKS = [
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail("");
  };

  return (
    <footer className="w-full flex flex-col z-10 backdrop-blur-md border-r border-ink">
      <div className="px-5 border-t border-stroke pt-8">
        {/* Main footer content */}
        <div className="w-full flex flex-col items-center pt-2 justify-between ">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_400px] gap-4">
            {/* Column 1: Wordmark + Tagline */}
            <div className="text-base sm:text-lg font-medium text-ink tracking-[-0.03em]">
              <p>© {new Date().getFullYear()} STUDIO filé</p>
            </div>
            {/* Column 2: Navigation Links */}
            <div className="space-y-4 tracking-[-0.03em] font-medium">
              <h3 className="text-base sm:text-lg text-light">Navigation</h3>
              <nav className="space-y-2 flex flex-col pb-4">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base sm:text-lg text-ink hover:text-light transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Conditions & Policies */}
            <div className="space-y-4 tracking-[-0.03em] font-medium pb-8 sm:pb-0">
              <h3 className="text-base sm:text-lg text-light">
                Conditions & Policies
              </h3>
              <nav className="space-y-2 flex flex-col">
                {CONDITIONS_POLICIES_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base sm:text-lg text-ink hover:text-light transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 4: Social + Newsletter */}
            <div className="space-y-16 sm:col-span-2 md:col-span-1">
              <div className="pt-1">
                {/* Social Links */}

                <div className="flex flex-row justify-between pb-12 px-1">
                  <a
                    href="#"
                    className="transition-colors"
                    aria-label="Instagram"
                  >
                    <SimpleIcon
                      icon={siInstagram}
                      size={28}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="Instagram"
                    />
                  </a>
                  <a href="#" className="transition-colors" aria-label="Xt">
                    <SimpleIcon
                      icon={siX}
                      size={28}
                      className="fill-ink hover:fill-light  transition-colors"
                      ariaLabel="Xt"
                    />
                  </a>
                  <a href="#" className="transition-colors" aria-label="TikTok">
                    <SimpleIcon
                      icon={siTiktok}
                      size={28}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="TikTok"
                    />
                  </a>
                  <a
                    href="#"
                    className="transition-colors"
                    aria-label="Pinterest"
                  >
                    <SimpleIcon
                      icon={siPinterest}
                      size={28}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="Pinterest"
                    />
                  </a>
                </div>

                {/* Newsletter */}
                <div className="">
                  <h3 className="text-base sm:text-lg/6 tracking-[-0.03em] font-medium text-ink leading-tight pb-3">
                    Get updates and special offers on new products. <br /> No
                    weekly spam.
                  </h3>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-8 sm:pt-24 pb-4 sm:pb-3">
          <div
            className="w-full bg-ink sm:bg-stroke"
            style={{
              aspectRatio: "22.203955 / 4.0943561",
              maskImage: "url(/images/logo/logo-footer.svg)",
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </div>
      </div>
    </footer>
  );
}

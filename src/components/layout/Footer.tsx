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
    // <footer className="w-full absolute bottom-0 z-10 backdrop-blur-lg border-t py-16 md:py-20 md:px-16 lg:px-24 xl:px-36 tracking-tight">
    <footer className="w-full flex flex-col z-10 backdrop-blur-md border-t border-white">
      {/* Main footer content */}
      <div className="w-full flex flex-col items-center py-20 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-36">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-16 md:gap-4">
          {/* Column 1: Wordmark + Tagline */}
          <div className="flex flex-row sm:flex-col justify-between sm:justify-start md:justify-between ">
            <div
              className="h-7 bg-ink mb-4"
              style={{
                aspectRatio: "22.203955 / 4.0943561",
                maskImage: "url(/images/logo/logo-black.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "left center",
              }}
            />
            <div className="text-xs font-mono text-ink flex flex-col sm:justify-end tracking-tight">
              <p>© {new Date().getFullYear()} Studiofile</p>
            </div>
          </div>
          {/* Column 2: Links */}
          <div className="space-y-4 text-light tracking-tight">
            <h3 className="text-sm sm:text-xs font-mono">Navigation</h3>
            <nav className="space-y-4 flex flex-col pb-4">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm sm:text-xs font-mono text-ink hover:text-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <h3 className="text-sm sm:text-xs font-mono">
              Conditions & Policies
            </h3>
            <nav className="space-y-4 flex flex-col">
              {CONDITIONS_POLICIES_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm sm:text-xs font-mono text-ink hover:text-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Social + Newsletter */}
          <div className="space-y-16 sm:col-span-2 md:col-span-1">
            {/* Social Links */}
            <div>
              <div className="flex flex-row justify-between">
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
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-xs tracking-tight font-mono text-ink pb-2">
                Get updates and special offers on new products. No weekly spam,
                we promise.
              </h3>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div
          className="w-full bg-ink"
          style={{
            aspectRatio: "22.203955 / 4.0943561",
            maskImage: "url(/images/logo/logo-black.svg)",
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>
    </footer>
  );
}

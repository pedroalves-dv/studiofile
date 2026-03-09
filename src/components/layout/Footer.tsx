"use client";

import Link from "next/link";
import { SimpleIcon } from "@/components/ui/SimpleIcon";
import { siInstagram, siPinterest, siX, siTiktok } from "simple-icons";
import { useState } from "react";
import { ArrowButton } from "../ui/ArrowButton";

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
    <footer className="w-full absolute bottom-0 z-10 backdrop-blur-lg border-t py-20">
      {/* Main footer content */}
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Wordmark + Tagline */}
          <div className="flex flex-col justify-between">
            <div
              className="h-6 w-[170px] bg-ink"
              style={{
                maskImage: "url(/images/logo/logo-270-45.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
              }}
            />
            <div className="text-xs text-ink flex flex-col justify-end">
              <p>© {new Date().getFullYear()} Studiofile</p>
            </div>
          </div>
          {/* Column 2: Links */}
          <div className="space-y-4 text-light">
            <h3 className="text-xs tracking-normal font-mono">Navigation</h3>
            <nav className="space-y-2 flex flex-col pb-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-ink hover:text-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <h3 className="text-xs tracking-normal font-mono">
              Conditions & Policies
            </h3>
            <nav className="space-y-2 flex flex-col">
              {CONDITIONS_POLICIES_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-ink hover:text-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Social + Newsletter */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="space-y-3">
              <div className="flex gap-6">
                <a
                  href="#"
                  className="transition-colors"
                  aria-label="Instagram"
                >
                  <SimpleIcon
                    icon={siInstagram}
                    size={18}
                    className="fill-ink hover:fill-light transition-colors"
                    ariaLabel="Instagram"
                  />
                </a>
                <a
                  href="#"
                  className="transition-colors"
                  aria-label="Pinterest"
                >
                  <SimpleIcon
                    icon={siX}
                    size={18}
                    className="fill-ink hover:fill-light  transition-colors"
                    ariaLabel="Xt"
                  />
                </a>
                <a
                  href="#"
                  className="transition-colors"
                  aria-label="Pinterest"
                >
                  <SimpleIcon
                    icon={siTiktok}
                    size={18}
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
                    size={18}
                    className="fill-ink hover:fill-light transition-colors"
                    ariaLabel="Pinterest"
                  />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs tracking-normal font-mono text-ink">
                Get updates on new releases, early-bird notifications, and
                special offers.
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-canvas border rounded-xl border-stroke text-ink placeholder-light text-sm focus:outline-none focus:border-muted transition-colors"
                  required
                />
                <ArrowButton
                  label="Subscribe"
                  type="submit"
                  className="w-full px-3 py-2.5 bg-ink text-canvas text-xs tracking-display font-mono rounded-xl"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Wordmark + Tagline */}
          <div className="flex flex-row sm:flex-col justify-between ">
            <div
              className="h-7 bg-ink mb-4"
              style={{
                aspectRatio: "22.203955 / 4.0943561",
                maskImage: "url(/images/logo/logo-small.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "left center",
              }}
            />
            <div className="text-[.65rem] text-ink flex flex-col sm:justify-end">
              <p>© {new Date().getFullYear()} Studiofile</p>
            </div>
          </div>
          {/* Column 2: Links */}
          <div className="space-y-4 text-light">
            <h3 className="text-sm sm:text-xs font-mono">Navigation</h3>
            <nav className="space-y-4 flex flex-col pb-4">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm sm:text-xs text-ink hover:text-light transition-colors"
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
                  className="text-sm sm:text-xs text-ink hover:text-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Social + Newsletter */}
          <div className="space-y-10">
            {/* Social Links */}
            <div className="space-y-3 px-1">
              <div className="flex flex-row justify-between">
                <a
                  href="#"
                  className="transition-colors"
                  aria-label="Instagram"
                >
                  <SimpleIcon
                    icon={siInstagram}
                    size={24}
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
                    size={24}
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
                    size={24}
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
                    size={24}
                    className="fill-ink hover:fill-light transition-colors"
                    ariaLabel="Pinterest"
                  />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-xs tracking-normal font-mono text-ink">
                Get updates on new releases, early-bird notifications, and
                special offers.
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-canvas border rounded-xl border-stroke 
                  text-ink placeholder-light text-sm focus:outline-none focus:border-muted 
                  transition-colors"
                  required
                />
                <ArrowButton
                  label="Subscribe"
                  type="submit"
                  glowColor="var(--color-black)"
                  className="w-full px-3 py-2.5 bg-ink text-canvas text-xs tracking-display 
                  font-mono rounded-xl"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

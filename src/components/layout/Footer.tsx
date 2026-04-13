// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { SimpleIcon } from "@/components/ui/SimpleIcon";
import { siInstagram, siPinterest, siX, siTiktok } from "simple-icons";
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
  return (
    <footer className="w-full flex flex-col bg-canvas/20 z-10 transform-gpu will-change-[backdrop-filter] contain-paint">
      <div className="px-site border-t border-stroke pt-3">
        {/* ── Mobile layout ── */}
        <div className="flex flex-col gap-10 sm:hidden pt-4">
          {/* Newsletter first on mobile */}
          <div className="">
            <div className="flex flex-col px-1 mb-3">
              {/* <p className="text-base font-medium text-light tracking-[-0.02em] mb-3">
                Newsletter
              </p> */}
              <p className="text-base tracking-[-0.02em] font-medium text-ink leading-snug ">
                New products & special offers.
              </p>
            </div>

            <NewsletterForm />
          </div>

          {/* Nav + Policies in two columns */}
          <div className="grid grid-cols-2 gap-x-4 px-1">
            {/* Col 1: Nav */}
            <div className="space-y-3">
              <h3 className="text-base tracking-[-0.02em] font-medium text-light">
                Navigation
              </h3>
              <nav className="flex flex-col">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base tracking-[-0.02em] font-medium text-ink hover:text-light transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 2: Policies */}
            <div className="space-y-3">
              <h3 className="text-base tracking-[-0.02em] font-medium text-light">
                Policies
              </h3>
              <nav className="flex flex-col">
                {CONDITIONS_POLICIES_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base tracking-[-0.02em] font-medium text-ink hover:text-light transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex flex-row justify-between px-1">
            <a href="#" aria-label="Instagram">
              <SimpleIcon
                icon={siInstagram}
                size={28}
                className="fill-ink hover:fill-light transition-colors"
                ariaLabel="Instagram"
              />
            </a>
            <a href="#" aria-label="X">
              <SimpleIcon
                icon={siX}
                size={28}
                className="fill-ink hover:fill-light transition-colors"
                ariaLabel="X"
              />
            </a>
            <a href="#" aria-label="TikTok">
              <SimpleIcon
                icon={siTiktok}
                size={28}
                className="fill-ink hover:fill-light transition-colors"
                ariaLabel="TikTok"
              />
            </a>
            <a href="#" aria-label="Pinterest">
              <SimpleIcon
                icon={siPinterest}
                size={28}
                className="fill-ink hover:fill-light transition-colors"
                ariaLabel="Pinterest"
              />
            </a>
          </div>
        </div>

        {/* ── Desktop layout (unchanged) ── */}
        <div className="hidden sm:block">
          <div className="w-full grid grid-cols-1 sm:grid-cols-[auto_minmax(0,380px)] md:grid-cols-[auto_auto_minmax(0,380px)] xl:grid-cols-[1fr_1fr_1fr_minmax(0,380px)]">
            {/* Column 1: Copyright */}
            <div className="hidden sm:block sm:order-3 md:hidden xl:block xl:order-1 text-base sm:text-lg font-medium text-ink tracking-[-0.04em] pb-8">
              <p>© {new Date().getFullYear()} STUDIO filé</p>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-4 tracking-[-0.04em] font-medium order-2 sm:order-1 md:order-1 lg:order-1 xl:order-2 pb-8 sm:pb-12">
              <h3 className="text-base sm:text-lg text-light">Navigation</h3>
              <nav className="space-y-2 flex flex-col">
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

            {/* Column 3: Policies */}
            <div className="space-y-4 tracking-[-0.04em] font-medium order-3 sm:order-2 pb-12">
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
            <div className="space-y-16 sm:col-span-1 md:col-span-1 order-4">
              <div className="pt-1">
                <div className="flex flex-row justify-between pb-12 px-0.5">
                  <a href="#" aria-label="Instagram">
                    <SimpleIcon
                      icon={siInstagram}
                      size={22}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="Instagram"
                    />
                  </a>
                  <a href="#" aria-label="X">
                    <SimpleIcon
                      icon={siX}
                      size={22}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="X"
                    />
                  </a>
                  <a href="#" aria-label="TikTok">
                    <SimpleIcon
                      icon={siTiktok}
                      size={22}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="TikTok"
                    />
                  </a>
                  <a href="#" aria-label="Pinterest">
                    <SimpleIcon
                      icon={siPinterest}
                      size={22}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="Pinterest"
                    />
                  </a>
                </div>
                <div>
                  <div className="flex flex-col px-1 mb-3">
                    <p className="text-lg tracking-[-0.03em] font-medium text-ink leading-snug ">
                      New products & special offers.
                    </p>
                  </div>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[7rem] sm:h-[15rem] md:h-[22rem] pt-20 pb-4 sm:pb-3"></div>
      </div>
    </footer>
  );
}

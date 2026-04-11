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
    <footer className="w-full flex flex-col bg-canvas/20  z-10 transform-gpu will-change-[backdrop-filter] contain-paint">
      <div className="px-5 border-t border-stroke pt-3">
        {/* Main footer content */}
        <div className="w-full flex flex-col items-center justify-between ">
          <div className="w-full grid grid-cols-1 sm:grid-cols-[auto_minmax(0,380px)] md:grid-cols-[auto_auto_minmax(0,380px)] xl:grid-cols-[1fr_1fr_1fr_minmax(0,380px)]">
            {/* Column 1: Wordmark + Tagline */}
            <div className="hidden sm:block sm:order-3 md:hidden xl:block xl:order-1 text-base sm:text-lg font-medium text-ink tracking-[-0.04em] pb-8">
              <p>© {new Date().getFullYear()} STUDIO filé</p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-4 tracking-[-0.04em] font-medium order-2 sm:oder-1 md:orde-1 lg:order-1 xl:order-2 pb-8 sm:pb-12 ">
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

            {/* Column 3: Conditions & Policies */}
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
                {/* Social Links */}

                <div className="flex flex-row justify-between pb-14 px-0.5">
                  <a
                    href="#"
                    className="transition-colors"
                    aria-label="Instagram"
                  >
                    <SimpleIcon
                      icon={siInstagram}
                      size={22}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="Instagram"
                    />
                  </a>
                  <a href="#" className="transition-colors" aria-label="Xt">
                    <SimpleIcon
                      icon={siX}
                      size={22}
                      className="fill-ink hover:fill-light  transition-colors"
                      ariaLabel="Xt"
                    />
                  </a>
                  <a href="#" className="transition-colors" aria-label="TikTok">
                    <SimpleIcon
                      icon={siTiktok}
                      size={22}
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
                      size={22}
                      className="fill-ink hover:fill-light transition-colors"
                      ariaLabel="Pinterest"
                    />
                  </a>
                </div>

                {/* Newsletter */}
                <div className="">
                  <h3 className="text-base sm:text-lg/6 tracking-[-0.04em] font-medium text-light leading-tight pb-4">
                    Get updates and special offers on new products. <br /> No
                    weekly spam.
                  </h3>
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

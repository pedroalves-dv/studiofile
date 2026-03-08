'use client';

import Link from 'next/link';
import { SimpleIcon } from '@/components/ui/SimpleIcon';
import { siInstagram, siPinterest, siX, siTiktok } from 'simple-icons';
import { useState } from 'react';

const FOOTER_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/about#process' },
  { label: 'Contact', href: '/contact' },
];

const CONDITIONS_POLICIES_LINKS = [
  { label: 'Terms of Service', href: '/policies/terms-of-service' },
  { label: 'Privacy Policy', href: '/policies/privacy-policy' },
  { label: 'Refund Policy', href: '/policies/refund-policy' },
];

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-ink text-canvas border-t border-stone-800">
      {/* Main footer content */}
      <div className="container-wide py-16 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Wordmark + Tagline */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-2xl tracking-wide">
              STUDIO filé
            </h2>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4 mb-2">
            <h3 className="text-xs tracking-display font-mono text-muted text-canvas/90">
            Navigation</h3>
            <nav className="space-y-2 flex flex-col pb-4">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-canvas/80 hover:text-canvas transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          
            <h3 className="text-xs tracking-display font-mono text-muted text-canvas/90">
            Conditions & Policies</h3>
            <nav className="space-y-2 flex flex-col pb-4">
              {CONDITIONS_POLICIES_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-canvas/80 hover:text-canvas transition-colors"
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
                  className="text-canvas/80 hover:text-canvas transition-colors"
                  aria-label="Instagram"
                >
                  <SimpleIcon 
                    icon={siInstagram} 
                    size={18}
                    className="fill-canvas/80 hover:fill-canvas transition-colors"
                    ariaLabel="Instagram"
                  />
                </a>
                <a
                  href="#"
                  className="text-canvas/80 hover:text-canvas transition-colors text-sm font-mono"
                  aria-label="Pinterest"
                >
                  <SimpleIcon 
                    icon={siX} 
                    size={18}
                    className="fill-canvas/80 hover:fill-canvas transition-colors"
                    ariaLabel="Xt"
                  />
                </a>
                <a
                  href="#"
                  className="text-canvas/80 hover:text-canvas transition-colors text-sm font-mono"
                  aria-label="Pinterest"
                >
                  <SimpleIcon 
                    icon={siTiktok} 
                    size={18}
                    className="fill-canvas/80 hover:fill-canvas transition-colors"
                    ariaLabel="TikTok"
                  />
                </a>
                <a
                  href="#"
                  className="text-canvas/80 hover:text-canvas transition-colors text-sm font-mono"
                  aria-label="Pinterest"
                >
                  <SimpleIcon 
                    icon={siPinterest} 
                    size={18}
                    className="fill-canvas/80 hover:fill-canvas transition-colors"
                    ariaLabel="Pinterest"
                  />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm tracking-normal font-mono text-canvas/90">
                Get updates on new releases, early-bird notifications, and special offers.
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-ink border border-stone-700 text-canvas placeholder-canvas/50 text-sm focus:outline-none focus:border-accent transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full uppercase px-3 py-2 bg-accent text-ink text-xs tracking-display font-mono transition-opacity hover:opacity-80"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-canvas/10 mx-28">
        <div className="py-6 flex flex-col md:flex-row items-center justify-between 
        gap-4 text-xs text-canvas/70">
          <p>© {new Date().getFullYear()} Studiofile</p>
          
        </div>
      </div>
    </footer>
  );
}

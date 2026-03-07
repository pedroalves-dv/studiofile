'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { useState } from 'react';

const FOOTER_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/about#process' },
  { label: 'Contact', href: '/contact' },
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
      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Wordmark + Tagline */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-display">
              Studiofile
            </h2>
            <p className="text-sm text-canvas/80 leading-relaxed">
              Objects made to last.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-display font-mono text-canvas/90">Links</h3>
            <nav className="space-y-2 flex flex-col">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-canvas/80 hover:text-canvas transition-colors link-underline"
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
              <h3 className="text-xs uppercase tracking-display font-mono text-canvas/90">Follow</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-canvas/80 hover:text-canvas transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="text-canvas/80 hover:text-canvas transition-colors text-sm font-mono"
                  aria-label="Pinterest"
                >
                  Pinterest
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-display font-mono text-canvas/90">
                Newsletter
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
                  className="w-full px-3 py-2 bg-accent text-ink text-xs uppercase tracking-display font-mono transition-opacity hover:opacity-80"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-canvas/10 mt-12">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-canvas/70">
          <p>© {new Date().getFullYear()} Studiofile</p>
          <div className="flex gap-4 flex-wrap justify-center md:justify-end">
            <Link href="/policies/privacy-policy" className="hover:text-canvas transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/policies/terms-of-service" className="hover:text-canvas transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/policies/refund-policy" className="hover:text-canvas transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

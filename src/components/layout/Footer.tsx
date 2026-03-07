'use client';

import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

const FOOTER_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Contact', href: '/contact' },
  { label: 'Policies', href: '/policies/privacy' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
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
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Wordmark + Tagline */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-widest">
              Studiofile
            </h2>
            <p className="text-sm text-canvas/80 leading-relaxed">
              Modular, functional home decor and furniture. Premium design studio aesthetic.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-mono text-canvas/90">Links</h3>
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
              <h3 className="text-xs uppercase tracking-wider font-mono text-canvas/90">Follow</h3>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-canvas/80 hover:text-canvas transition-colors"
                      aria-label={link.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-mono text-canvas/90">
                Newsletter
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-ink border border-stone-700 text-canvas placeholder-canvas/50 text-sm focus:outline-none focus:border-accent transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-accent text-ink text-xs uppercase tracking-wider font-mono transition-opacity hover:opacity-80"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800 bg-black/30">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-canvas/70">
          <p>© 2025 Studiofile. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap justify-center md:justify-end">
            <Link href="/policies/privacy" className="hover:text-canvas transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/policies/terms" className="hover:text-canvas transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/policies/refund" className="hover:text-canvas transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

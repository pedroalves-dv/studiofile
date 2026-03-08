'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, ArrowRight } from 'lucide-react';
import { useScroll } from '@/hooks/useScroll';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { SearchBar } from '@/components/search/SearchBar';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/about#process' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const { isScrolled } = useScroll(60);
  const { totalQuantity: cartCount, cartIconRef, openCart } = useCart();
  const { wishlistIconRef, openDrawer: openWishlist, totalCount: wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useScrollLock(isSearchOpen);

  const wordmarkRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === 'undefined') return;

    const hasAnimated = sessionStorage.getItem('sf-wordmark-animated');
    if (hasAnimated) return;

    const el = wordmarkRef.current;
    if (!el) return;

    const letters = el.innerText.split('');
    el.innerHTML = letters
      .map((l) => `<span style="display:inline-block">${l === ' ' ? '&nbsp;' : l}</span>`)
      .join('');

    gsap.from(el.querySelectorAll('span'), {
      y: 10,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.04,
      onComplete: () => sessionStorage.setItem('sf-wordmark-animated', '1'),
    });
  }, {});

  // Close both overlays on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Search overlay — full-screen */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-canvas/95 backdrop-blur-sm flex flex-col">
          <div className="container-wide pt-6">
            <div className="flex items-center gap-4">
              <SearchBar
                autoFocus
                onClose={() => setIsSearchOpen(false)}
                placeholder="Search products..."
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="flex-shrink-0 p-2 hover:text-accent transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-sm bg-canvas/90 border-b border-border'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Wordmark */}
            <Link
              href="/"
              className="font-display text-sm md:text-base tracking-wide text-ink hover:text-accent transition-colors"
              aria-label="Studiofile — Home"
            >
              <span ref={wordmarkRef}>STUDIO filé</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs tracking-wider text-ink hover:text-accent transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4 md:gap-5">
              {/* Search toggle */}
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 hover:text-accent transition-colors"
                aria-label="Open search"
                aria-expanded={isSearchOpen}
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {/* Wishlist (desktop) */}
              <button
                ref={wishlistIconRef}
                onClick={openWishlist}
                className="hidden sm:flex p-2 hover:text-accent transition-colors relative"
                aria-label={`Open wishlist${wishlistCount > 0 ? ` — ${wishlistCount} items` : ''}`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-canvas text-xs flex items-center justify-center rounded-full font-mono leading-none">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                ref={cartIconRef}
                onClick={openCart}
                className="p-2 hover:text-accent transition-colors relative"
                aria-label={`Open cart${cartCount > 0 ? ` — ${cartCount} items` : ''}`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-canvas text-xs flex items-center justify-center rounded-full font-mono leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 hover:text-accent transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav
            className="md:hidden border-t border-border bg-canvas"
            aria-label="Mobile navigation"
          >
            <div className="container-wide py-4 space-y-1">
              {/* Mobile search */}
              <div className="pb-4 border-b border-border mb-2">
                <SearchBar onClose={() => setIsMobileMenuOpen(false)} />
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm uppercase tracking-wider text-ink hover:text-accent transition-colors py-3 border-b border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <button
                className="flex items-center gap-2 text-sm uppercase tracking-wider text-ink hover:text-accent transition-colors py-3 w-full"
                onClick={() => { setIsMobileMenuOpen(false); openWishlist() }}
                aria-label="Open wishlist"
              >
                <Heart size={18} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto font-mono text-xs bg-accent text-canvas px-2 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-20" aria-hidden="true" />
    </>
  );
}

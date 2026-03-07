'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useScroll } from '@/hooks/useScroll';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { SearchBar } from '@/components/search/SearchBar';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const { isScrolled } = useScroll(60);
  const { state: cartState } = useCartContext();
  const cartCount = cartState.cart?.totalQuantity ?? 0;
  const { items: wishlistItems } = useWishlistContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      {/* Backdrop for search overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-ink/20 z-40 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        />
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
              className="font-display text-sm md:text-base uppercase tracking-widest text-ink hover:text-accent transition-colors"
              aria-label="Studiofile — Home"
            >
              Studiofile
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-wider text-ink hover:text-accent transition-colors relative group"
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
                className="hidden sm:flex p-2 hover:text-accent transition-colors relative"
                aria-label={`Open wishlist${wishlistItems.length > 0 ? ` (${wishlistItems.length} items)` : ''}`}
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-canvas text-xs flex items-center justify-center rounded-full font-mono leading-none">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                className="p-2 hover:text-accent transition-colors relative"
                aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
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

          {/* Search overlay panel — real SearchBar */}
          {isSearchOpen && (
            <div className="pb-4 border-t border-border">
              <SearchBar
                autoFocus
                onClose={() => setIsSearchOpen(false)}
              />
            </div>
          )}
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
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Open wishlist"
              >
                <Heart size={18} />
                Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-auto font-mono text-xs bg-accent text-canvas px-2 py-0.5">
                    {wishlistItems.length}
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

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, ArrowRight } from 'lucide-react';
import { useScroll } from '@/hooks/useScroll';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { SearchBar } from '@/components/search/SearchBar';

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
              <span className="group cursor-pointer">
                <svg
   width="80"
   viewBox="0 0 1919.9989 319.49326"
   className="h-4 w-auto [&_path]:fill-ink [&_path]:transition-colors [&_path]:duration-300 group-hover:[&_path]:fill-accent"
   version="1.1"
   id="svg1"
   xmlns="http://www.w3.org/2000/svg">
    <defs
     id="defs1" /><g
     id="layer1"
     transform="translate(-4.1462708e-4,-220.50673)"><g
       id="g1-0-8-6"
       transform="matrix(15.642184,0,0,15.642184,-567.96969,-558.10067)">
        <path
         d="m 296.8598,131.0148 q 0,-6.78334 1.11625,-10.13208 1.20211,-3.34874 2.91941,-3.34874 0.85865,0 1.54557,0.94452 0.68692,0.94452 1.37384,2.06076 0.77279,1.11625 1.45971,2.06076 0.68692,0.94452 1.54557,0.94452 0.51519,0 1.03038,-0.60106 0.60106,-0.68692 1.03038,-1.54557 0.51519,-0.85865 0.77279,-1.7173 0.34346,-0.94452 0.34346,-1.54557 0,-1.20211 -1.88903,-2.31836 -1.80317,-1.11625 -4.29326,-1.11625 -2.57595,0 -4.98017,1.11625 -2.31836,1.03038 -4.20739,3.09114 -1.88904,1.9749 -3.09115,4.98018 -1.20211,2.91941 -1.4597,6.61161 l -0.34346,4.37912 q -0.17173,1.03038 -0.94452,1.45971 l -1.54557,0.77279 q -1.63144,0.85865 -1.63144,1.63143 0,0.42933 0.34346,0.85865 0.42933,0.34346 0.94452,0.34346 h 1.54557 q 1.11625,0 1.11625,1.11625 v 26.70404 q 0,1.45971 -0.34346,2.2325 -0.34347,0.77278 -1.54558,1.37384 -1.54557,0.68692 -2.49008,0.68692 -0.94452,-0.0859 -0.94452,1.11625 0,1.37384 1.63144,1.37384 1.4597,0 3.26287,-0.2576 1.80317,-0.25759 3.94979,-0.25759 2.14663,0 4.12153,0.25759 1.9749,0.2576 3.6922,0.2576 1.88903,0 1.88903,-1.20211 0,-0.68692 -0.34346,-0.94452 -0.2576,-0.2576 -0.85865,-0.34346 -0.60106,-0.17173 -1.45971,-0.2576 -0.77278,-0.17173 -1.80316,-0.68692 -0.94452,-0.42932 -1.28798,-1.11624 -0.2576,-0.77279 -0.2576,-2.2325 v -26.70404 q 0,-1.11625 1.03038,-1.11625 h 6.43989 q 0.85865,0 0.94451,-0.34346 0.17173,-0.42932 0.17173,-1.28797 v -0.42933 q 0,-0.68692 -0.17173,-1.03038 -0.17173,-0.34346 -0.94451,-0.34346 h -6.35402 q -1.03038,0 -1.03038,-1.11625 z m 16.0745,-10.99073 q -1.54557,0 -2.66182,1.45971 -1.11625,1.4597 -1.11625,3.26287 0,1.80317 1.11625,3.26287 1.11625,1.45971 2.66182,1.45971 1.54557,0 2.66181,-1.45971 1.11625,-1.4597 1.11625,-3.26287 0,-1.80317 -1.11625,-3.26287 -1.11624,-1.45971 -2.66181,-1.45971 z m 3.26287,16.4861 q 0,-1.80317 -0.85865,-1.80317 -0.34346,0 -0.77279,0.42933 -0.34346,0.34346 -0.94451,0.94451 -0.60106,0.60106 -1.54557,1.37385 -0.85866,0.77278 -2.14663,1.54557 -2.14663,1.20211 -3.34874,1.80316 -1.11625,0.60106 -1.11625,1.54558 0,0.85865 0.51519,0.94451 0.60106,0 1.20212,0.2576 0.68692,0.17173 1.20211,0.94451 0.60105,0.77279 0.60105,3.09115 v 20.26416 q 0,1.7173 -0.25759,2.49009 -0.17173,0.68692 -1.11625,1.20211 -0.51519,0.25759 -0.94452,0.34346 -0.42932,0 -0.85865,0.0859 -0.34346,0.0859 -0.60105,0.34347 -0.17173,0.25759 -0.17173,0.85865 0,1.4597 1.28797,1.4597 0.94452,0 2.49009,-0.34346 1.54557,-0.25759 3.77807,-0.25759 2.06076,0 3.86393,0.25759 1.80316,0.34346 3.09114,0.34346 1.54557,0 1.54557,-1.37384 0,-0.60105 -0.34346,-0.85865 -0.25759,-0.2576 -0.77279,-0.34346 -0.42932,-0.17173 -1.11624,-0.2576 -0.60106,-0.0859 -1.28798,-0.42932 -0.77278,-0.42933 -1.11624,-1.20211 -0.2576,-0.77279 -0.2576,-2.31836 z m 18.13536,-14.33947 q 0,-1.80317 0.0859,-3.26288 0.17173,-1.4597 0.17173,-2.57595 0,-0.77278 -0.17173,-1.20211 -0.17173,-0.42933 -0.85865,-0.42933 -0.42933,0 -1.88904,1.03039 -1.37384,0.94451 -4.37912,2.06076 -1.54557,0.60105 -2.74768,0.94451 -1.11625,0.2576 -1.11625,1.20212 0,0.51519 0.51519,0.77278 0.60106,0.2576 1.28798,0.51519 0.77279,0.2576 1.28798,0.77279 0.60105,0.51519 0.60105,1.63144 v 44.64985 q 0,1.28797 -0.25759,2.06076 -0.2576,0.68692 -1.45971,1.11624 -1.37384,0.51519 -2.31836,0.51519 -0.85865,0 -0.85865,1.20212 0,1.37384 1.54557,1.37384 1.20212,0 2.91942,-0.2576 1.80316,-0.25759 4.03566,-0.25759 2.14662,0 4.03566,0.25759 1.88903,0.2576 3.34874,0.2576 1.7173,0 1.7173,-1.20211 0,-0.77279 -0.34346,-1.03038 -0.34346,-0.34347 -0.94452,-0.42933 -0.51519,-0.0859 -1.20211,-0.0859 -0.68692,-0.0859 -1.37384,-0.42932 -1.63144,-0.77279 -1.63144,-3.60634 z"
         id="text2-2-2-0-5-3-0-1-7-7"
         transform="matrix(0.33456124,0,0,0.33456124,35.163653,11.689048)"
         aria-label="fil" /><path
         d="m 300.38027,147.41504 h -5.58123 q -1.03038,0 -1.03038,-0.77279 v -0.17173 l 0.25759,-1.37384 q 0.68692,-3.52047 2.91941,-5.83883 2.2325,-2.31835 5.23777,-2.31835 2.74769,0 4.46499,1.80316 1.80317,1.80317 1.80317,3.9498 0,2.83354 -1.9749,3.77806 -1.88903,0.94452 -6.09642,0.94452 z m 12.70803,2.66181 q 1.54557,0 2.23249,-0.34346 0.68693,-0.34346 0.68693,-1.4597 0,-2.74769 -1.03039,-5.15191 -0.94451,-2.40422 -2.74768,-4.20739 -1.80317,-1.80316 -4.37912,-2.83355 -2.57595,-1.11624 -5.6671,-1.11624 -3.60633,0 -6.69747,1.4597 -3.00528,1.45971 -5.23777,4.12153 -2.2325,2.66182 -3.52047,6.52575 -1.20211,3.77806 -1.20211,8.50064 0,4.72258 1.11624,8.50065 1.11625,3.77806 3.17701,6.43988 2.06076,2.66182 4.89431,4.03566 2.91941,1.4597 6.43988,1.4597 3.34874,0 6.01056,-1.11624 2.66182,-1.11625 4.55085,-2.57595 1.9749,-1.54558 3.00528,-3.09115 1.03038,-1.54557 1.03038,-2.49009 0,-0.94451 -0.68692,-0.94451 -0.2576,0 -0.94452,0.77278 -0.60105,0.77279 -1.80316,1.71731 -1.11625,0.94451 -2.91942,1.7173 -1.7173,0.77278 -4.12152,0.77278 -5.4095,0 -8.84411,-4.63671 -3.34874,-4.63672 -3.34874,-12.62217 v -2.06076 q 0,-0.85865 0.17173,-1.11625 0.17174,-0.2576 0.85866,-0.2576 z m -4.63671,-28.42134 q 2.06076,-1.54557 2.06076,-3.43461 0,-1.37384 -0.77279,-2.14662 -0.68692,-0.85865 -1.63143,-0.85865 -0.94452,0 -1.63144,0.68692 -0.68692,0.60105 -1.63144,1.80316 l -9.70275,12.62217 h 2.23249 z"
         id="text2-2-2-0-5-3-8-1-61-3-8"
         transform="matrix(0.33456124,0,0,0.33456124,53.331157,11.229447)"
         aria-label="é" /></g><path
       d="m 147.57589,534.37042 c 63.53385,0 102.94093,-41.41764 102.94093,-96.90923 0,-55.08948 -39.40708,-96.50712 -102.94093,-96.50712 h -15.2803 c -9.65071,0 -15.28029,-4.42325 -15.28029,-10.85705 0,-6.83593 5.62958,-10.85706 15.28029,-10.85706 H 239.25765 V 232.78567 H 102.13712 c -62.327518,0 -102.13670537292,38.60285 -102.13670537292,94.89867 0,56.29582 39.80918737292,94.89867 102.13670537292,94.89867 h 17.69297 c 12.4655,0 16.48663,6.83592 16.48663,12.86761 0,5.62958 -4.02113,12.46551 -16.88874,12.46551 H 6.0321097 v 86.45429 z m 257.15886,0 V 319.23996 h 42.22187 V 232.78567 H 251.93181 v 86.45429 h 42.62398 V 534.37042 Z M 721.00377,411.72596 V 232.78567 H 610.8248 v 183.76564 c 0,15.2803 -8.44437,26.53946 -22.11621,26.53946 -13.67184,0 -22.11622,-11.25916 -22.11622,-26.53946 V 232.78567 H 456.41341 V 411.72596 C 456.41341,490.5401 508.6881,540 588.70859,540 c 80.4226,0 132.29518,-49.4599 132.29518,-128.27404 z m 131.69926,122.64446 c 100.93037,0 161.64947,-63.13174 161.64947,-152.40083 0,-87.25852 -60.31699,-149.18392 -162.05158,-149.18392 H 734.48181 v 301.58475 z m -3.2169,-205.07763 c 35.38594,0 53.88314,20.50776 53.88314,53.48103 0,32.16904 -18.09508,53.07892 -53.48103,53.07892 h -9.2486 V 329.29279 Z M 1133.1838,534.37042 V 232.78567 h -110.179 v 301.58475 z m 336.3746,-152.40083 c 0,-89.26908 -67.555,-154.8135 -164.0621,-154.8135 -96.105,0 -163.66,65.54442 -163.66,154.8135 0,90.87754 67.555,158.03041 163.66,158.03041 96.5071,0 164.0621,-67.15287 164.0621,-158.03041 z m -216.3368,1.60845 c 0,-30.9627 20.5077,-53.88314 52.2747,-53.88314 32.169,0 52.6768,22.92044 52.6768,53.88314 0,30.56059 -20.5078,53.88315 -52.6768,53.88315 -31.767,0 -52.2747,-23.32256 -52.2747,-53.88315 z"
       id="text2-2-2-9-4-7-4"
       aria-label="STUDIO" /></g></svg>
              </span>
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

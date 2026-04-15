// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { customerLogout } from "@/lib/shopify/auth";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/context/ToastContext";
import { LogOut } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { HeartIcon, type HeartIconHandle } from "@/components/ui/HeartIcon";
import Logo from "public/images/logo/newlogov2.svg";

import { UserIcon, type UserIconHandle } from "@/components/ui/UserIcon";
import { MenuIcon, type MenuIconHandle } from "@/components/ui/MenuIcon";
import {
  UserRoundCheckIcon,
  type UserRoundCheckIconHandle,
} from "@/components/ui/UserRoundCheckIcon";
import {
  ShoppingBagIcon,
  type ShoppingBagIconHandle,
} from "@/components/ui/ShoppingBagIcon";
import { CustomerAvatar } from "@/components/account/CustomerAvatar";

// ─── Constants ────────────────────────────────────────────────────────────────

const CLOSE_DURATION = 250;

const NAV_LINKS: {
  label: string;
  href: string;
  hideOnDesktop?: boolean;
  linkClassName?: string;
}[] = [
  { label: "TOTEM", href: "/products/totem" },
  { label: "Products", href: "/products" },
  { label: "Studio", href: "/about", hideOnDesktop: true },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

// Extracted once — desktop dropdown and mobile overlay share this list
const ACCOUNT_LINKS = [
  { label: "My Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Settings", href: "/account/settings" },
  { label: "Addresses", href: "/account/addresses" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

// 3-state machine eliminates dual-boolean flicker
type PanelState = "closed" | "open" | "closing";

interface HeaderProps {
  isLoggedIn?: boolean;
  customer?: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  } | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Header({ isLoggedIn = false, customer }: HeaderProps) {
  const menuIconRef = useRef<MenuIconHandle>(null);
  const userIconRef = useRef<UserIconHandle>(null);
  const userRoundCheckIconRef = useRef<UserRoundCheckIconHandle>(null);
  const cartIconRef = useRef<ShoppingBagIconHandle>(null);
  const heartIconRef = useRef<HeartIconHandle>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Timer refs — prevent stale closures and memory leaks
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State refs — let useCallback read current state without stale closure issues
  const menuStateRef = useRef<PanelState>("closed");
  const accountStateRef = useRef<PanelState>("closed");

  const pathname = usePathname();
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isPendingLogout, startLogoutTransition] = useTransition();
  const { totalQuantity: cartCount, openCart, closeCart, isOpen } = useCart();
  const {
    totalCount: wishlistCount,
    isOpen: isWishlistOpen,
    openDrawer: openWishlist,
    closeDrawer: closeWishlist,
  } = useWishlist();

  const [menuState, setMenuState] = useState<PanelState>("closed");
  const [accountState, setAccountState] = useState<PanelState>("closed");

  // Keep refs in sync with state
  menuStateRef.current = menuState;
  accountStateRef.current = accountState;

  // Convenience derived booleans
  const isMobileMenuOpen = menuState === "open";
  const isClosingMenu = menuState === "closing";
  const isAccountOpen = accountState === "open";
  const isClosingAccount = accountState === "closing";

  // ─── Close helpers ──────────────────────────────────────────────────────────

  const closeMenu = useCallback(() => {
    // Guard: only close if actually open — prevents useClickOutside from
    // flashing the panel on every click when it's already closed
    if (menuStateRef.current !== "open") return;
    if (menuCloseTimer.current) return;
    setMenuState("closing");
    menuCloseTimer.current = setTimeout(() => {
      setMenuState("closed");
      menuCloseTimer.current = null;
    }, CLOSE_DURATION);
  }, []);

  const closeAccount = useCallback(() => {
    // Same guard as above — critical for preventing the flash-on-click bug
    if (accountStateRef.current !== "open") return;
    if (accountCloseTimer.current) return;
    setAccountState("closing");
    accountCloseTimer.current = setTimeout(() => {
      setAccountState("closed");
      accountCloseTimer.current = null;
    }, CLOSE_DURATION);
  }, []);

  // Extracted logout — used by both desktop dropdown and mobile overlay
  const handleLogout = useCallback(() => {
    closeAccount();
    startLogoutTransition(async () => {
      try {
        await customerLogout();
        toastSuccess("You've been signed out");
        router.push("/");
      } catch {
        toastError("Sign out failed. Please try again.");
      }
    });
  }, [closeAccount, router, toastSuccess, toastError]);

  // ─── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
      if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current);
    };
  }, []);

  // ─── Outside click ──────────────────────────────────────────────────────────

  useClickOutside([accountRef], closeAccount);

  // Locks scroll for both full-screen mobile overlays.
  // Note: isAccountOpen also locks scroll on desktop (small dropdown) — to
  // gate it to mobile only, add a useIsMobile hook and wrap isAccountOpen with it.
  useScrollLock(isMobileMenuOpen);

  // ─── Keyboard: Escape ───────────────────────────────────────────────────────

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeMenu();
      closeAccount();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeMenu, closeAccount]);

  // ─── Close everything on route change ──────────────────────────────────────

  useEffect(() => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current);
    menuCloseTimer.current = null;
    accountCloseTimer.current = null;
    setMenuState("closed");
    setAccountState("closed");
  }, [pathname]);

  // ─── Sync hamburger icon animation ─────────────────────────────────────────

  useEffect(() => {
    if (isMobileMenuOpen) {
      menuIconRef.current?.startAnimation();
    } else {
      menuIconRef.current?.stopAnimation();
    }
  }, [isMobileMenuOpen]);

  // ─── Derived state ──────────────────────────────────────────────────────────

  const hasActiveLink = NAV_LINKS.some((l) => pathname === l.href);
  const someIconActive =
    isOpen ||
    isWishlistOpen ||
    isAccountOpen ||
    isClosingAccount ||
    isMobileMenuOpen ||
    isClosingMenu;

  // Hover effects on desktop only — touch devices get sticky :hover after tap
  const iconOpacity = (isActive: boolean) =>
    cn(
      "transition-opacity duration-1000",
      !someIconActive &&
        "md:group-hover:opacity-35 md:hover:!opacity-100 md:group-hover:duration-200",
      someIconActive && !isActive && "opacity-35",
    );

  const navLinkOpacity = (href: string) =>
    cn(
      "transition-opacity duration-1000",
      "md:group-hover:opacity-35 md:hover:!opacity-100 md:group-hover:duration-200",
      hasActiveLink && pathname !== href && "opacity-35",
    );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop for mobile menu */}
      {/* {(isMobileMenuOpen || isClosingMenu) && (
        <div
          className="fixed inset-0 backdrop-blur-md z-40 md:hidden"
          onClick={() => {
            if (!isClosingMenu) closeMenu();
          }}
        />
      )} */}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-canvas">
        <div className="h-full px-site border-b sm:border-r border-stroke">
          <div className="h-full grid grid-cols-[auto_1fr] items-end pb-3">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Studiofile — Home"
              className="group w-fit"
            >
              <Logo className="h-6 w-30 fill-current text-ink md:group-hover:text-light transition-colors mb-0.5" />
            </Link>

            {/* Nav + Icons */}
            <div className="h-full flex justify-self-end items-end">
              {/* Desktop Nav */}
              <nav
                className="hidden md:flex md:gap-8 lg:gap-20 items-end h-full mr-16 lg:mr-36 group"
                aria-label="Main navigation"
              >
                {NAV_LINKS.filter((l) => !l.hideOnDesktop).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-end text-ink font-medium tracking-[-0.04em] text-lg leading-none w-fit",
                      navLinkOpacity(link.href),
                      link.linkClassName,
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div
                className={cn(
                  "flex gap-12 sm:gap-8",
                  !someIconActive && "group",
                )}
              >
                {/* Account / Login — desktop only */}
                {isLoggedIn ? (
                  <div ref={accountRef} className="relative hidden md:block">
                    <button
                      onClick={() => {
                        if (isAccountOpen || isClosingAccount) {
                          closeAccount();
                        } else {
                          setAccountState("open");
                          closeCart();
                          if (isMobileMenuOpen) closeMenu();
                        }
                      }}
                      className={cn(
                        "relative h-full flex items-end",
                        iconOpacity(isAccountOpen || isClosingAccount),
                      )}
                      aria-label="My account"
                      aria-expanded={isAccountOpen}
                      onMouseEnter={() =>
                        userRoundCheckIconRef.current?.startAnimation()
                      }
                      onMouseLeave={() =>
                        userRoundCheckIconRef.current?.stopAnimation()
                      }
                    >
                      <UserRoundCheckIcon
                        ref={userRoundCheckIconRef}
                        size={28}
                      />
                    </button>

                    {/* Account dropdown — desktop only */}
                    {isAccountOpen && (
                      <div
                        style={{
                          animation: "navSlideDown 0.15s ease-out both",
                          transformOrigin: "top",
                        }}
                        className="hidden md:flex absolute top-[calc(var(--header-height)-10px)] -right-4 min-w-[200px] bg-canvas border border-stroke rounded-lg z-50 flex-col"
                      >
                        <div className="p-1">
                          {ACCOUNT_LINKS.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeAccount}
                              className="block w-full text-left px-4 py-3 tracking-[-0.04em] text-lg text-ink hover:bg-white transition-colors rounded-md"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-stroke p-1">
                          <button
                            type="button"
                            disabled={isPendingLogout}
                            onClick={handleLogout}
                            className="flex items-center justify-between w-full px-4 py-3 tracking-[-0.04em] text-lg text-ink hover:bg-accent hover:text-canvas rounded-md transition-colors font-medium disabled:opacity-35 disabled:pointer-events-none"
                          >
                            {isPendingLogout ? "Signing out..." : "Sign out"}
                            {!isPendingLogout && (
                              <LogOut size={16} strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className={cn(
                      "relative h-full hidden md:flex items-end",
                      iconOpacity(false),
                    )}
                    aria-label="Sign in"
                    onMouseEnter={() => userIconRef.current?.startAnimation()}
                    onMouseLeave={() => userIconRef.current?.stopAnimation()}
                  >
                    <UserIcon ref={userIconRef} size={28} />
                  </Link>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => {
                    if (isWishlistOpen) {
                      closeWishlist();
                    } else {
                      openWishlist();
                      if (isMobileMenuOpen) closeMenu();
                      if (isAccountOpen) closeAccount();
                      if (isOpen) closeCart();
                    }
                  }}
                  className={cn(
                    "flex h-full relative items-end",
                    iconOpacity(isWishlistOpen),
                  )}
                  aria-label={
                    isWishlistOpen
                      ? "Close wishlist"
                      : `Open wishlist${wishlistCount > 0 ? ` — ${wishlistCount} items` : ""}`
                  }
                  onMouseEnter={() => heartIconRef.current?.startAnimation()}
                  onMouseLeave={() => heartIconRef.current?.stopAnimation()}
                >
                  <HeartIcon ref={heartIconRef} size={28} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-3 -right-3 w-4 h-4 text-sm font-medium">
                      ({wishlistCount})
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => {
                    if (isOpen) {
                      closeCart();
                    } else {
                      openCart();
                      if (isMobileMenuOpen) closeMenu();
                      if (isAccountOpen) closeAccount();
                    }
                  }}
                  className={cn("h-full flex relative", iconOpacity(isOpen))}
                  aria-label={
                    isOpen
                      ? "Close cart"
                      : `Open cart${cartCount > 0 ? ` — ${cartCount} items` : ""}`
                  }
                  onMouseEnter={() => cartIconRef.current?.startAnimation()}
                  onMouseLeave={() => cartIconRef.current?.stopAnimation()}
                >
                  <ShoppingBagIcon ref={cartIconRef} />
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-3 w-4 h-4 text-sm font-medium">
                      ({cartCount})
                    </span>
                  )}
                </button>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      closeMenu();
                    } else if (menuState === "closed") {
                      setMenuState("open");
                      closeCart();
                      if (isAccountOpen) closeAccount();
                    }
                  }}
                  className={cn(
                    "md:hidden h-full flex relative -mr-1",
                    iconOpacity(isMobileMenuOpen || isClosingMenu),
                  )}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  <MenuIcon ref={menuIconRef} size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {(isMobileMenuOpen || isClosingMenu) && (
        <nav
          style={{
            animation: `${isClosingMenu ? "navSlideUp" : "navSlideDown"} ${CLOSE_DURATION}ms ease-in-out forwards`,
          }}
          className="fixed top-[var(--header-height)] bottom-0 left-0 right-0 z-[45] md:hidden px-site py-6 bg-white flex flex-col overflow-y-auto"
          aria-label="Mobile navigation"
        >
          <div className="group ">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "flex w-fit text-left text-6xl tracking-[-0.07em] leading-[4rem] font-medium ligatures text-ink",
                  "transition-opacity duration-1000",
                  // No hover effects on mobile — sticky tap-hover is broken UX
                  "md:group-hover:opacity-35 md:hover:!opacity-100 md:group-hover:duration-200",
                  hasActiveLink && pathname !== link.href && "opacity-35",
                  link.linkClassName,
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-6">
              <div className="border-t border-stroke -mx-site" />
            </div>
            <Link
              href={isLoggedIn ? "/account" : "/account/login"}
              onClick={closeMenu}
              className={cn(
                "flex w-full text-left text-6xl tracking-[-0.07em] leading-[4rem] font-medium text-ink ligatures",
                "transition-opacity duration-200",
                "md:group-hover:opacity-35 md:hover:!opacity-100",
                hasActiveLink && "opacity-35",
              )}
            >
              {isLoggedIn ? "My Account" : "Sign in"}
            </Link>
            {isLoggedIn && (
              <button
                type="button"
                disabled={isPendingLogout}
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className={cn(
                  "flex w-fit text-left text-6xl tracking-[-0.07em] leading-[4rem] font-medium text-ink ligatures",
                  "transition-opacity duration-200",
                  "md:group-hover:opacity-35 md:hover:!opacity-100",
                  isPendingLogout && "opacity-35 pointer-events-none",
                )}
              >
                {isPendingLogout ? "Signing out..." : "Sign out"}
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Spacer */}
      <div className="h-[var(--header-height)]" aria-hidden="true" />
    </>
  );
}

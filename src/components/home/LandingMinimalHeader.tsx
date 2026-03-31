"use client";

import Link from "next/link";
import Logo from "public/images/logo/newlogov2.svg";

export function LandingMinimalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-canvas">
      <div className="h-full px-5 border-b sm:border-r border-light">
        {/* 2-column grid: logo left, nav+icons right */}
        <div className="h-full grid grid-cols-2 items-end pb-3">
          {/* Logo */}
          <Link href="/" aria-label="Studiofile — Home" className="group ">
            <Logo className="h-6 w-30 fill-current text-ink group-hover:text-light transition-colors mb-0.5" />
            {/* <LogoHover className="h-7 w-auto" /> */}
          </Link>
          <div className="h-full flex justify-self-end items-end gap-12">
            <p className="flex items-end font-medium tracking-[-0.05em] text-lg hover:text-light transition-colors duration-200 leading-none mr-36">
              © 2026 Studio filé — Paris
            </p>
            <p className="flex items-end font-medium tracking-[-0.05em] text-lg hover:text-light transition-colors duration-200 leading-none">
              Coming Soon / [Countdown]
            </p>
            <p className="flex items-end font-medium tracking-[-0.05em] text-lg hover:text-light transition-colors duration-200 leading-none">
              TOTEM Collection
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

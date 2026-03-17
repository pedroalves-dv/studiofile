"use client";

import Link from "next/link";

export function LandingMinimalHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 px-6 md:px-12 py-5">
      <Link href="/coming-soon" aria-label="Studiofile">
        <span
          className="group relative block"
          style={{
            aspectRatio: "22.203955 / 4.0943561",
            height: "2.2rem",
          }}
        >
          {/* Default state */}
          <div
            className="absolute inset-0 bg-canvas transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            style={{
              maskImage: "url(/images/logo/logo-black.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center top",
            }}
          />
          {/* Hover state */}
          <div
            className="absolute inset-0 bg-canvas transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              maskImage: "url(/images/logo/logo.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center top",
            }}
          />
        </span>
      </Link>
    </header>
  );
}

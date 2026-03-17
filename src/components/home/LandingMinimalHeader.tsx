"use client";

export function LandingMinimalHeader() {
  return (
    <header className="fixed bg-canvas w-full top-0 left-0 z-50 px-6 md:px-12 py-5 border-b border-ink pb-2 flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <span
          className="group relative block"
          style={{
            aspectRatio: "22.203955 / 4.0943561",
            height: "2.2rem",
          }}
        >
          <div
            className="absolute inset-0 bg-ink opacity-100 group-hover:opacity-0 transition-opacity duration-300"
            style={{
              maskImage: "url(/images/logo/logo-black.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center top",
            }}
          />
          <div
            className="absolute inset-0 bg-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              maskImage: "url(/images/logo/logo.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center top",
            }}
          />
        </span>
        <div className="flex gap-12">
          <p className="font-body text-md tracking-tighter font-medium pt-2 pr-44">
            © 2026 Studio filé — Paris
          </p>
          <p className="font-body text-md tracking-tighter font-medium pt-2">
            Coming Soon / [Countdown]
          </p>
          <p className="font-body text-md tracking-tighter font-medium pt-2">
            TOTEM Collection
          </p>
        </div>
      </div>
    </header>
  );
}

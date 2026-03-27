import Link from "next/link";

import { ArrowButton } from "@/components/ui/ArrowButton";

export function ProductSpotlight() {
  return (
    <section className="relative w-full border-b border-ink">
      {/* ── MOBILE layout (< sm) ── */}
      <div className="sm:hidden flex flex-col">
        {/* Image — top, tall */}
        <div
          className="w-full h-[60dvh] bg-stone-100 relative overflow-hidden"
          aria-label="TOTEM configurator"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
          {/* CTA overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <span className="text-label text-muted">Try the configurator</span>
            <ArrowButton
              href="/shop"
              label="Configure"
              className="w-fit mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md  border border-ink  disabled:opacity-50"
            />
          </div>
        </div>

        {/* Text — below image */}
        <div className="px-5 py-12">
          <p className="text-4xl font-medium tracking-[-0.07em] leading-[1] pb-8">
            Introducing
            <span className="block font-display tracking-tighter text-7xl text-black">
              TOTEM
            </span>
            a fully{" "}
            <span className="text-light tracking-[-4px] font-medium">
              modular lamp
            </span>{" "}
            that adapts to you.
          </p>
          <ArrowButton
            href="/shop"
            label="Discover TOTEM"
            className="w-fit mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md  border border-ink  disabled:opacity-50"
          />
        </div>
      </div>

      {/* ── DESKTOP layout (sm+) ── */}
      <div className="hidden sm:grid pl-5 grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left — sticky text */}
        <div className="sticky top-[var(--header-height)] py-20">
          <p className="text-7xl font-medium tracking-[-0.07em] pb-12 leading-[0.9]">
            Introducing
            <span className="inline-block font-display tracking-tighter text-8xl text-black pl-4 pr-2">
              {" "}
              TOTEM
            </span>
            , a fully{" "}
            <span className="text-light tracking-[-7px] font-medium">
              modular lamp
            </span>{" "}
            that adapts to you.
          </p>
          <ArrowButton
            href="/shop"
            label="Discover"
            className="w-fit mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md  border border-ink  disabled:opacity-50"
          />
        </div>

        {/* Right — image */}
        <div
          className="h-[calc(100dvh-var(--header-height))] bg-stone-100 relative overflow-hidden"
          aria-label="TOTEM configurator"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <span className="text-label text-muted">Paris studio, 2024</span>
            <ArrowButton
              href="/shop"
              label="Configure"
              className="w-fit mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md  border border-ink  disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

import { ArrowButton } from "@/components/ui/ArrowButton";

export function ProductSpotlight() {
  return (
    <section
      data-snap
      className="relative w-full border-b border-light section-height"
    >
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
        <div className="px-5 py-24 space-y-4">
          <p className="text-7xl font-medium tracking-[-0.06em] leading-[1]">
            Introducing TOTEM — <br />
          </p>
          <p className="text-6xl text-light font-medium tracking-[-0.06em] leading-[0.9] pb-16">
            The{" "}
            <span className="text-ink tracking-[-4px] font-medium">
              modular lamp
            </span>{" "}
            that adapts to you.
          </p>
          <ArrowButton
            href="/shop"
            label="Discover TOTEM"
            className="w-fit px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md  border border-ink  disabled:opacity-50"
          />
        </div>
      </div>

      {/* ── DESKTOP layout (sm+) ── */}
      <div className="section-height hidden sm:grid pl-5 grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left — sticky text */}
        <div className="py-24 space-y-4 xl:space-y-8">
          <p className="text-9xl font-medium tracking-[-0.07em] leading-[0.9]">
            Introducing <br />
            <span className="tracking-[-0.07em]">
              TOT
              <span className="ml-[1px]">
                E<span className="-ml-[5px]">M —</span>
              </span>
            </span>
          </p>
          <p className="text-9xl text-light font-medium tracking-[-0.07em] leading-[0.8] pb-16">
            The{" "}
            <span className="text-ink tracking-[-0.07em]">
              mo<span className="ml-[1px]">d</span>
              <span className="-ml-[2px]">u</span>
              <span className="-ml-[4px]">l</span>ar lamp
            </span>{" "}
            that adapts to you.
          </p>
        </div>

        {/* Right — image */}
        <div className="h-full relative" aria-label="TOTEM configurator">
          <div className="h-full bg-lighter" />
          <div className="absolute bottom-24 left-20">
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

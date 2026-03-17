import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ArrowButton } from "@/components/ui/ArrowButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Studiofile is a 3D printing and design studio creating modular, functional home decor and furniture. Designed in Paris, printed to order.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/about`,
  },
  openGraph: {
    title: "About — Studiofile",
    description:
      "Studiofile is a 3D printing and design studio creating modular, functional home decor and furniture. Designed in Paris, printed to order.",
  },
};

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Designed in-studio",
    description:
      "Each object begins as a concept sketch, refined through iterative digital modelling until form and function are inseparable.",
  },
  {
    number: "02",
    title: "Printed to order",
    description:
      "No stock. No waste. Every piece is printed the moment you order it, using industry-grade FDM and resin technology.",
  },
  {
    number: "03",
    title: "Shipped to you",
    description:
      "Carefully packaged and dispatched within 5–7 business days. Each piece arrives ready to live in your space.",
  },
];

const STUDIO_VALUES = [
  {
    title: "Precision",
    description:
      "Every tolerance, every layer, every surface is considered. We hold our work to the same standard as the finest traditional craft.",
  },
  {
    title: "Sustainability",
    description:
      "Print-on-demand means zero overproduction. We use recyclable materials and minimal packaging — objects made to outlast trends.",
  },
  {
    title: "Modularity",
    description:
      "Our pieces are designed to adapt. Mix finishes, combine elements, reconfigure your space as life changes around you.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="section-padding-bottom">
      {/* ─── Hero ─── */}
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — info */}
          <div className="space-y-8 md:sticky md:top-24">
            <div>
              <p className="text-label text-muted mb-4">About us</p>
              <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight pb-8">
                Made to last.
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* ─── Studio Story ─── */}
      <section className="border-b border-stroke pb-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — long-form text */}
            <div className="space-y-6">
              <p className="text-base text-ink tracking-tight">
                Studiofile began with a simple frustration: the objects we
                wanted for our homes didn&apos;t exist. Too much furniture was
                made to be disposable, too little was made to be beautiful and
                functional at the same time.
              </p>
              <p className="text-base text-ink tracking-tight">
                We started experimenting with 3D printing not as a novelty, but
                as a genuine design tool — one that allowed us to iterate fast,
                eliminate waste, and produce things that couldn&apos;t be made
                any other way.
              </p>
              <p className="text-base text-ink tracking-tight">
                Every object in the Studiofile collection is designed from the
                ground up for additive manufacturing. The layer lines, the
                geometric precision, the material properties — these aren&apos;t
                limitations to hide. They&apos;re part of the aesthetic.
              </p>
              <p className="text-base text-ink tracking-tight">
                We work in small batches, print to order, and ship from our
                Paris studio. No warehouses. No middlemen. Just objects made
                with intent, sent directly to the people who want them.
              </p>
            </div>

            {/* Right — image placeholder */}
            <div
              className="aspect-[4/5] bg-stone-100 relative overflow-hidden"
              aria-label="Studio image"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
              <div className="absolute bottom-6 left-6">
                <span className="text-label text-muted">
                  Paris studio, 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="border-b border-stroke pt-12 pb-8">
        <div className="container-wide">
          <p className="text-label text-muted mb-12">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="space-y-4">
                <span className="font-mono text-4xl text-border">
                  {step.number}
                </span>
                <h3 className="font-display text-4xl leading-tight tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-ink leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Studio Values ─── */}
      <section className="border-b border-stroke pt-12 pb-8">
        <div className="container-wide">
          <p className="text-label text-muted mb-4">What we stand for</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {STUDIO_VALUES.map((value) => (
              <div key={value.title} className="space-y-4">
                <h3 className="font-display text-4xl mt-8 tracking-tigh">
                  {value.title}
                </h3>
                <p className="text-sm text-ink leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Founder ─── */}
      <section className="border-b border-stroke pt-12 pb-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo placeholder */}
            <div className="aspect-square max-w-sm bg-stone-100 relative overflow-hidden order-last md:order-first">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
            </div>

            {/* Bio */}
            <div className="space-y-6">
              <p className="text-label text-muted">Founder</p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight tracking-tigh">
                Alex Dumont
              </h2>
              <p className="text-label text-accent tracking-wider">
                Designer & Creative Director
              </p>
              <p className="text-base text-ink leading-relaxed">
                Alex trained as an industrial designer before spending a decade
                working across product, furniture, and spatial design studios in
                Paris and Amsterdam. Studiofile is the convergence of everything
                he&apos;s learned: rigorous process, honest materials, and
                design that earns its place in a home.
              </p>
              <p className="text-base text-ink leading-relaxed">
                &ldquo;I wanted to make things that get better as they age —
                objects that develop a patina, that you remember acquiring. Not
                things you replace.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section>
        <div className="text-center space-y-8">
          <h2 className="font-display text-6xl md:text-8xl leading-tight pt-40 pb-8">
            TOTEM
          </h2>

          <ArrowButton
            href="/shop"
            label="Shop"
            glowColor="var(--color-black)"
            className="mt-12 sm:ml-[22rem] h-12 w-24 px-8 py-3 bg-ink text-white text-xs 
                    tracking-display font-mono rounded-xl flex items-center 
                    justify-center self-start mx-auto"
          />
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <main id="main-content" className="px-5 section-height ">
      {/* ─── Hero / Studio Story ─── */}
      <section className="border-b border-stroke pb-12 sm:-mr-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — long-form text */}
          <div className="pt-12 sm:pt-[var(--header-height)] space-y-6 md:sticky md:top-0">
            {/* Left — info */}

            <h1 className="text-7xl sm:text-9xl font-semibold tracking-[-0.07em] pb-12 sm:leading-[0.9] leading-[4rem]">
              The studio
            </h1>
            <div className="text-ink tracking-[-0.03em] text-lg leading-tight space-y-6 pr-12">
              <p className="">
                <span className="italic mr-1">STUDIO filé</span> began with a
                simple frustration: the objects we wanted for our homes
                didn&apos;t exist. Too much furniture was made to be disposable,
                too little was made to be beautiful and functional at the same
                time.
              </p>
              <p className="">
                We started experimenting with 3D printing not as a novelty, but
                as a genuine design tool — one that allowed us to iterate fast,
                eliminate waste, and produce things that couldn&apos;t be made
                any other way.
              </p>
              <p className="">
                Every object in the Studiofile collection is designed from the
                ground up for additive manufacturing. The layer lines, the
                geometric precision, the material properties — these aren&apos;t
                limitations to hide. They&apos;re part of the aesthetic.
              </p>
              <p className="">
                We work in small batches, print to order, and ship from our
                Paris studio. No warehouses. No middlemen. Just objects made
                with intent, sent directly to the people who want them.
              </p>
            </div>
          </div>

          {/* Right — image placeholder */}
          <div
            className="aspect-[4/5] bg-stone-100 relative overflow-hidden"
            aria-label="Studio image"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
            <div className="absolute bottom-6 left-6">
              <span className="text-label text-muted">Paris studio, 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Studio Values / Process ─── */}
      <section className="border-b border-stroke pt-[var(--header-height)] pb-8 section-height">
        <h1 className="px-5 text-7xl sm:text-9xl font-semibold tracking-[-0.07em] pb-12 sm:leading-[0.9] leading-[4rem]">
          What we stand for
        </h1>
        <div className="px-5 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-40">
          {STUDIO_VALUES.map((value) => (
            <div key={value.title} className="space-y-4">
              <h3 className="text-4xl mt-8 tracking-tighter">
                {value.title}
              </h3>
              <p className="text-lg text-ink tracking-[-0.03em] leading-tight">
                {value.description}
              </p>
            </div>
          ))}
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="space-y-4">
              {/* <span className="text-4xl tracking-tight">{step.number}</span> */}
              <h3 className="text-4xl mt-8 tracking-tighter">
                {step.title}
              </h3>
              <p className="text-lg text-ink tracking-[-0.03em] leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Team / Studio ─── */}
      <section className="border-b border-stroke pb-8 section-height">
        <div className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Bio */}
          <div className="pt-[var(--header-height)] space-y-6 md:sticky md:top-28 pr-12">
            <h1 className="text-7xl sm:text-9xl font-semibold tracking-[-0.07em] pb-12 sm:leading-[0.9] leading-[4rem]">
              The team
            </h1>
            <h2 className="text-4xl md:text-5xl leading-tight tracking-tighter">
              Alex Dumont
            </h2>
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight">
              Designer & Creative Director
            </p>
            <p className="text-lg text-ink tracking-[-0.03em] leading-tight">
              Alex trained as an industrial designer before spending a decade
              working across product, furniture, and spatial design studios in
              Paris and Amsterdam. Studiofile is the convergence of everything
              he&apos;s learned: rigorous process, honest materials, and design
              that earns its place in a home.
            </p>
            <p className="text-lg text-light tracking-[-0.03em] leading-tight">
              &ldquo;I wanted to make things that get better as they age —
              objects that develop a patina, that you remember acquiring. Not
              things you replace.&rdquo;
            </p>
          </div>
          {/* Photo placeholder */}
          <div className="aspect-[4/5] bg-stone-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-centered ">
        <div className="text-center">
          <h2 className="font-display text-7xl md:text-10xl leading-tight pb-8 ">
            TOTEM
          </h2>

          <ArrowButton
            href="/shop"
            label="Shop"
            className="w-fit mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md  border border-ink  disabled:opacity-50"
          />
        </div>
      </section>
    </main>
  );
}

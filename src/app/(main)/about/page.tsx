import type { Metadata } from "next";
import { FadeUp } from "@/components/ui/FadeUp";
import { ArrowTracedButton } from "@/components/ui/ArrowTracedButton";

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
    <div className="px-site">
      {/* ─── Hero / Studio Story ─── */}
      <section className="section-min-h page-pt page-pb">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — long-form text */}
          <div className="md:sticky md:top-[calc(var(--header-height)+90px)] self-start space-y-6">
            {/* Left — info */}

            <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.07em] leading-[0.9] pb-2">
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
          <div className="sm:-mt-[90px] sm:-mr-5">
            <div
              className="aspect-[4/5] bg-lighter relative overflow-hidden"
              aria-label="Studio image"
            ></div>
            <div
              className="aspect-[4/5] bg-light relative overflow-hidden"
              aria-label="Studio image"
            ></div>
          </div>
        </div>
      </section>

      {/* ─── Studio Values / Process ─── */}
      <section className="page-pt page-pb section-min-h">
        <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.07em] sm:leading-[0.9] leading-[4rem] pb-6">
          The process
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-40 ">
          {STUDIO_VALUES.map((value) => (
            <div key={value.title} className="space-y-4">
              <h3 className="text-4xl mt-8 tracking-tighter">{value.title}</h3>
              <p className="text-lg text-ink tracking-[-0.03em] leading-tight">
                {value.description}
              </p>
            </div>
          ))}
          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="space-y-4">
              {/* <span className="text-4xl tracking-tight">{step.number}</span> */}
              <h3 className="text-4xl mt-8 tracking-tighter">{step.title}</h3>
              <p className="text-lg text-ink tracking-[-0.03em] leading-tight">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Team / Studio ─── */}
      <section className="page-pt page-pb section-min-h">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Bio */}
          <div className="space-y-6 md:sticky md:top-[calc(var(--header-height)+90px)]">
            <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.07em] pb-6 leading-[0.9]">
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
          <div
            className="aspect-[4/5] bg-lighter relative overflow-hidden -mx-site"
            aria-label="Photo of Alex Dumont"
          ></div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-80 sm:py-60 flex flex-col items-center">
        <h2 className="font-display text-7xl md:text-15xl tracking-tight leading-none mb-20">
          TOTEM
        </h2>

        <FadeUp delay={0.32}>
          <ArrowTracedButton
            href="/products"
            label="Explore TOTEM"
            className="w-fit bg-white btn btn-cta text-ink border border-ink/20"
          />
        </FadeUp>
      </section>
    </div>
  );
}

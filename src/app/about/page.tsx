import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Studiofile is a 3D printing and design studio creating modular, functional home decor and furniture. Designed in Paris, printed to order.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/about`,
  },
  openGraph: {
    title: 'About — Studiofile',
    description:
      'Studiofile is a 3D printing and design studio creating modular, functional home decor and furniture. Designed in Paris, printed to order.',
  },
};

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Designed in-studio',
    description:
      'Each object begins as a concept sketch, refined through iterative digital modelling until form and function are inseparable.',
  },
  {
    number: '02',
    title: 'Printed to order',
    description:
      'No stock. No waste. Every piece is printed the moment you order it, using industry-grade FDM and resin technology.',
  },
  {
    number: '03',
    title: 'Shipped to you',
    description:
      'Carefully packaged and dispatched within 5–7 business days. Each piece arrives ready to live in your space.',
  },
];

const STUDIO_VALUES = [
  {
    title: 'Precision',
    description:
      'Every tolerance, every layer, every surface is considered. We hold our work to the same standard as the finest traditional craft.',
  },
  {
    title: 'Sustainability',
    description:
      'Print-on-demand means zero overproduction. We use recyclable materials and minimal packaging — objects made to outlast trends.',
  },
  {
    title: 'Modularity',
    description:
      'Our pieces are designed to adapt. Mix finishes, combine elements, reconfigure your space as life changes around you.',
  },
];

export default function AboutPage() {
  return (
    <main id="main-content">
      {/* ─── Hero ─── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end bg-stone-900 overflow-hidden">
        {/* Background placeholder — replace with <Image> once real photo is available */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900"
          aria-hidden="true"
        >
          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay grain" />
        </div>

        <div className="relative container-wide pb-16 md:pb-24">
          <p className="text-label text-canvas/60 mb-4">Studiofile</p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-tight text-canvas">
            Design that<br />lasts.
          </h1>
        </div>
      </section>

      {/* ─── Studio Story ─── */}
      <section className="section-padding border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — long-form text */}
            <div className="space-y-6">
              <p className="text-label text-muted mb-8">Our story</p>
              <p className="text-lg text-ink/80 leading-relaxed">
                Studiofile began with a simple frustration: the objects we wanted for our homes
                didn&apos;t exist. Too much furniture was made to be disposable, too little was
                made to be beautiful and functional at the same time.
              </p>
              <p className="text-base text-ink/70 leading-relaxed">
                We started experimenting with 3D printing not as a novelty, but as a genuine
                design tool — one that allowed us to iterate fast, eliminate waste, and produce
                things that couldn&apos;t be made any other way.
              </p>
              <p className="text-base text-ink/70 leading-relaxed">
                Every object in the Studiofile collection is designed from the ground up for
                additive manufacturing. The layer lines, the geometric precision, the material
                properties — these aren&apos;t limitations to hide. They&apos;re part of the
                aesthetic.
              </p>
              <p className="text-base text-ink/70 leading-relaxed">
                We work in small batches, print to order, and ship from our Paris studio. No
                warehouses. No middlemen. Just objects made with intent, sent directly to the
                people who want them.
              </p>
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
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="section-padding border-b border-border">
        <div className="container-wide">
          <p className="text-label text-muted mb-12">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="space-y-4">
                <span className="font-mono text-4xl text-border">{step.number}</span>
                <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Studio Values ─── */}
      <section className="section-padding border-b border-border bg-stone-50">
        <div className="container-wide">
          <p className="text-label text-muted mb-12">What we stand for</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {STUDIO_VALUES.map((value) => (
              <div key={value.title} className="bg-stone-50 p-8 space-y-4">
                <h3 className="font-display text-2xl">{value.title}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Founder ─── */}
      <section className="section-padding border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo placeholder */}
            <div className="aspect-square max-w-sm bg-stone-100 relative overflow-hidden order-last md:order-first">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
            </div>

            {/* Bio */}
            <div className="space-y-6">
              <p className="text-label text-muted">Founder</p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                Alex Dumont
              </h2>
              <p className="text-label text-accent tracking-wider">
                Designer & Creative Director
              </p>
              <p className="text-base text-ink/70 leading-relaxed">
                Alex trained as an industrial designer before spending a decade working across
                product, furniture, and spatial design studios in Paris and Amsterdam. Studiofile
                is the convergence of everything he&apos;s learned: rigorous process, honest
                materials, and design that earns its place in a home.
              </p>
              <p className="text-base text-ink/70 leading-relaxed">
                &ldquo;I wanted to make things that get better as they age — objects that develop
                a patina, that you remember acquiring. Not things you replace.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-padding bg-ink text-canvas">
        <div className="container-narrow text-center space-y-8">
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Objects made to last.
          </h2>
          <p className="text-base text-canvas/70 max-w-md mx-auto">
            Explore the full Studiofile collection — designed in Paris, printed to order, shipped
            to you.
          </p>
          <Button asChild variant="secondary" size="lg" className="border-canvas text-canvas hover:bg-canvas hover:text-ink">
            <Link href="/shop">
              Shop the Collection
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

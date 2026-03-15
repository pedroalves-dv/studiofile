import { Metadata } from "next";
import { LandingHero } from "@/components/home/LandingHero";
import { LandingSignup } from "@/components/home/LandingSignup";

export const metadata: Metadata = {
  title: "TOTEM — Coming Soon | Studiofile",
  description:
    "A modular ceiling lighting system built from stackable 3D-printed shapes. Join the list for early access and 30% off at launch.",
};

const FEATURES = [
  {
    num: "01",
    title: "Modular system",
    body: "Stack shapes freely — any combination, as many as you want. No limits.",
  },
  {
    num: "02",
    title: "Made to order",
    body: "Each piece is 3D printed on demand. No stock, no waste, no compromise.",
  },
  {
    num: "03",
    title: "Ships worldwide",
    body: "Designed in Paris. Made wherever you are. Delivered to your door.",
  },
] as const;

const PERKS = [
  "Founding-batch pricing",
  "First access to the configurator",
  "Behind-the-scenes updates",
  "Exclusive first-run colorway",
] as const;

export default function ComingSoonPage() {
  return (
    <div className="bg-black">
      {/* Hero */}
      <LandingHero />

      {/* Features strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-accent/10 bg-black">
        {FEATURES.map((f, i) => (
          <div
            key={f.num}
            className={`px-6 md:px-10 py-10 flex flex-col gap-3
              ${i < FEATURES.length - 1 ? "border-b border-accent/10 md:border-b-0 md:border-r" : ""}`}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-accent/70">{f.num}</span>
            <h3 className="font-display text-canvas text-xl">{f.title}</h3>
            <p className="font-body text-canvas/45 text-sm leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Waitlist */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-accent/10 bg-black">
        {/* Left — perks */}
        <div className="px-6 md:px-12 py-12 md:py-16 border-b border-accent/10 md:border-b-0 md:border-r md:border-accent/10">
          <h2 className="font-display text-canvas text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] mb-6">
            Be first.<br />
            Get 30% off.
          </h2>
          <p className="font-body text-canvas/50 text-sm leading-relaxed max-w-sm mb-8">
            Join the list before launch and unlock a 30% founding discount
            on your first order.
          </p>

          <ul className="flex flex-col border-t border-accent/10">
            {PERKS.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-3 py-3 border-b border-accent/10
                  font-mono text-[11px] tracking-[0.12em] uppercase text-muted"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
                  aria-hidden="true"
                />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div className="px-6 md:px-12 py-12 md:py-16 flex flex-col justify-center">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent/70 mb-6">
            Reserve your spot
          </p>
          <LandingSignup />
        </div>
      </section>

      {/* Social bar */}
      <footer className="px-6 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-center
        gap-3 bg-black border-b border-accent/10">
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted/60">
          © 2025 Studiofile — Paris
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/studiofile.paris"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/70
              hover:text-accent transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@studiofile.paris"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/70
              hover:text-accent transition-colors duration-200"
          >
            TikTok
          </a>
        </div>
      </footer>
    </div>
  );
}

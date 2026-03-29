import { Metadata } from "next";
import { LandingSignup } from "@/components/home/LandingSignup";
import { LandingMinimalHeader } from "@/components/home/LandingMinimalHeader";
import { LandingParallaxImages } from "@/components/home/LandingParallaxImages";
import { ArrowRight } from "lucide-react";

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
    <div className="bg-canvas">
      {/* Logo-only fixed header */}
      <LandingMinimalHeader />

      {/* 1. TOTEM animation + image stack (unified scroll sequence) */}
      <LandingParallaxImages />

      {/* 3. Offer + form */}
      <section className="bg-canvas border-t border-stroke">
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-stroke">
          {/* Left — headline + perks */}
          <div className="px-6 md:px-12 py-8 md:py-12 border-b border-stroke md:border-b-0 md:border-r md:border-stroke">
            <h2 className="font-inter font-semibold tracking-tighter text-ink text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] mb-6">
              Be first.
              <br />
              Get 30% off.
            </h2>
            <p className="tracking-tight text-muted text-2xl tracking-tighter leading-6 max-w-sm mb-10">
              Join the list before launch and unlock a 30% founding discount on
              your first order.
            </p>

            <ul className="flex flex-col border-t border-ink pt-4">
              {PERKS.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 py-2.5
                    text-md tracking-tight  text-ink"
                >
                  <ArrowRight />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="px-6 md:px-32 py-16 md:py-24 flex flex-col justify-between">
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/studiofile.paris"
                target="_blank"
                rel="noopener noreferrer"
                className="text-md tracking-tight  text-muted
              hover:text-ink transition-colors duration-200"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@studiofile.paris"
                target="_blank"
                rel="noopener noreferrer"
                className="text-md tracking-tight text-muted
              hover:text-ink transition-colors duration-200"
              >
                TikTok
              </a>
            </div>

            <LandingSignup />
          </div>
        </div>

        {/* Features strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-stroke">
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              className={`px-6 md:px-10 py-4 pb-12 flex flex-col gap-3
                ${i < FEATURES.length - 1 ? "border-b border-stroke md:border-b-0 md:border-r md:border-stroke" : ""}`}
            >
              <span className="text-md tracking-tight text-muted">
                {f.num}
              </span>
              <h3 className="font-inter text-ink text-5xl tracking-tight">
                {f.title}
              </h3>
              <p className="text-muted text-md tracking-tight">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { ArrowButton } from "@/components/ui/ArrowButton";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about our products and services.",

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/faq`,
  },
};

export default function FaqPage() {
  const steps = [
    {
      title: "What's your return policy?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "Do you offer a warranty?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "How can I track my order?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "Do you ship internationally?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "Something went wrong with my order. What should I do?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "Something went wrong with my order. What should I do?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "Something went wrong with my order. What should I do?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      title: "Something went wrong with my order. What should I do?",
      description: "",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
  ];
  return (
    <main id="main-content" className="section-padding-bottom">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — info */}
          <div className="space-y-8 md:sticky md:top-24">
            <div className="px-6">
              <p className="text-label text-muted mb-4">FAQ</p>
              <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight">
                Any questions?
              </h1>
            </div>

            <p className="text-base text-ink tracking-tight px-6">
              We&apos;ve compiled answers to our most frequently asked questions
              here. If you can&apos;t find what you&apos;re looking for, feel
              free to reach out to us directly. We&apos;re always happy to help!
            </p>
          </div>

          <section className="relative flex flex-col w-full items-center border-t border-stroke tracking-tight">
            <AccordionRoot type="single" collapsible className="w-full">
              {steps.map((step, i) => (
                <AccordionItem
                  key={i}
                  value={`step-${i}`}
                  className="border-b border-stroke"
                >
                  <AccordionTrigger className="grid grid-cols-[10fr_1fr] md:grid-cols-2 px-6 pt-4">
                    <div className="flex flex-col text-left">
                      <p className="font-mono text-sm text-ink pb-4">
                        {step.title}
                      </p>
                      {/* <p className="font-mono text-sm text-light leading-none">
                        {step.description}
                      </p> */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <p className="font-mono text-sm text-ink p-4">
                      {step.detail}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </section>
          <div className="space-y-8 md:sticky md:top-24 px-6">
            <div>
              <p className="text-label text-muted mb-4">Uh oh</p>
              <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-tight">
                No dice, huh?
              </h1>
            </div>

            <p className="text-base text-ink tracking-tight">
              We&apos;re here to help. Please reach out to us directly, and
              we&apos;ll do our best to assist you.
            </p>
            <ArrowButton
              href="/contact"
              label="Contact Us"
              glowColor="var(--color-black)"
              className="py-2.5 bg-ink text-white text-xs 
                              tracking-display font-mono rounded-xl flex items-center 
                              justify-center mx-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

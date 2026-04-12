import type { Metadata } from "next";
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { FadeUp } from "@/components/ui/FadeUp";
import { ArrowTracedButton } from "@/components/ui/ArrowTracedButton";

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
    <div className="px-5">
      <section className="section-height page-pt page-pb">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — info */}
          <div className="space-y-8 xl:sticky xl:md:top-[calc(var(--header-height)+90px)]">
            <div className="h-full flex flex-col items-start justify-center space-y-8">
              <h1 className="text-7xl sm:text-9xl font-medium tracking-[-0.07em] pb-6 sm:-ml-[8px] leading-[0.9]">
                FAQ
              </h1>

              <p className="text-lg text-ink tracking-[-0.02em] leading-snug">
                We&apos;ve compiled answers to our most frequently asked
                questions here. <br className="hidden xl:block" />
                If you can&apos;t find what you&apos;re looking for, feel free
                to reach out to us directly.
              </p>
              <FadeUp delay={0.32}>
                <ArrowTracedButton
                  href="/contact"
                  label="Contact Us"
                  className="w-fit bg-white btn btn-cta text-ink border border-ink/20"
                />
              </FadeUp>
            </div>
          </div>

          {/* Right — Accordion */}
          <div className="relative flex flex-col w-full items-center rounded-lg bg-canvas border border-stroke tracking-tight">
            <AccordionRoot type="single" collapsible className="w-full">
              {steps.map((step, i) => (
                <AccordionItem
                  key={i}
                  value={`step-${i}`}
                  className="border-b border-stroke last:border-b-0"
                >
                  <AccordionTrigger className="grid grid-cols-[10fr_1fr] md:grid-cols-2 px-4 pt-4">
                    <div className="flex flex-col text-left">
                      <p className="text-lg text-ink tracking-[-0.03em] leading-tight pb-4">
                        {step.title}
                      </p>
                      {/* <p className="text-sm text-light leading-none">
                        {step.description}
                      </p> */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <p className="text-lg text-ink tracking-[-0.03em] leading-tight p-4">
                      {step.detail}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </div>
        </div>
      </section>
    </div>
  );
}

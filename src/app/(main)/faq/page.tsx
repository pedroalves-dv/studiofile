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
    <main id="main-content" className="px-6">
      <section className="section-height border-b border-stroke pt-[var(--header-height)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — info */}
          <div className="space-y-8 md:sticky md:top-28">
            <div className="">
              <h1 className="text-7xl sm:text-9xl font-body font-semibold tracking-[-0.07em] pb-8 sm:-ml-[5px] sm:leading-[0.9] leading-[4rem]">
                FAQ
              </h1>
            </div>

            <p className="text-lg text-ink font-body tracking-[-0.02em] leading-tight">
              We&apos;ve compiled answers to our most frequently asked questions
              here. <br />
              If you can&apos;t find what you&apos;re looking for, feel free to
              reach out to us directly.
            </p>
            {/* <ArrowButton
              href="/contact"
              label="Contact Us"
              className="block w-full text-center py-2.5 bg-white text-ink font-mono tracking-wide
         text-sm rounded-lg border border-stroke"
            /> */}
          </div>

          <div className="relative flex flex-col w-full items-center rounded-lg border border-stroke tracking-tight">
            <AccordionRoot type="single" collapsible className="w-full">
              {steps.map((step, i) => (
                <AccordionItem
                  key={i}
                  value={`step-${i}`}
                  className="border-b border-stroke last:border-b-0"
                >
                  <AccordionTrigger className="grid grid-cols-[10fr_1fr] md:grid-cols-2 px-6 pt-4">
                    <div className="flex flex-col text-left">
                      <p className="text-lg font-body text-ink tracking-[-0.03em] leading-tight pb-4">
                        {step.title}
                      </p>
                      {/* <p className="font-mono text-sm text-light leading-none">
                        {step.description}
                      </p> */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <p className="text-lg font-body text-ink tracking-[-0.03em] leading-tight p-4">
                      {step.detail}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </div>
        </div>
      </section>

      {/* <section className="pt-12 section-height">
        <div className="space-y-8">
          <div>
            <h1 className="text-[5.2rem] sm:text-9xl font-inter font-medium tracking-tighter pb-8 sm:-ml-[5px] sm:leading-[0.9] leading-[0.9]">
              No dice, huh?
            </h1>
          </div>

          <p className="text-lg text-ink tracking-[-0.04em] leading-tight">
            We&apos;re here to help. Please reach out to us directly, and
            we&apos;ll do our best to assist you.
          </p>
          <ArrowButton
            href="/contact"
            label="Contact Us"
            className="block w-full text-center py-2.5 bg-white text-ink font-mono tracking-wide
         text-sm rounded-lg border border-stroke"
          />
        </div>
      </section> */}
    </main>
  );
}

import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

export function ProcessSection() {
  const steps = [
    {
      // number: "/01",
      title: "Designed In-Studio",
      description:
        "Each object is meticulously designed by our team, balancing form and function.",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      // number: "/02",
      title: "Printed to Order",
      description:
        "Made fresh using precision 3D printing, minimizing waste and maximizing quality.",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      // number: "/03",
      title: "Shipped to You",
      description:
        "Carefully packaged and delivered worldwide. Every piece arrives in perfect condition.",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
    {
      // number: "/04",
      title: "Upgrade / Repair / Replace",
      description:
        "Carefully packaged and delivered worldwide. Every piece arrives in perfect condition.",
      detail:
        "Space is a three-dimensional continuum containing positions and directions.[1] In classical physics, physical space is often conceived in three linear dimensions. Modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime.[2] The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.",
    },
  ];

  return (
    <section className="relative flex items-center min-h-dvh border border-green-500 mt-60">
      {/* <div className="relative flex flex-col w-full items-center border-t border-stroke"></div> */}
      <AccordionRoot type="single" collapsible className="w-full">
        {steps.map((step, i) => (
          <AccordionItem
            key={i}
            value={`step-${i}`}
            className="border-b border-stroke"
          >
            <AccordionTrigger className="grid grid-cols-[10fr_1fr] md:grid-cols-[3fr_1fr] px-4 pt-4">
              {/* <div className="flex justify-end font-mono text-6xl font-bold text-ink tracking-tight">
                {step.number}
              </div> */}
              <div className="flex flex-col text-left sm:px-44">
                <p className="font-serif italic text-3xl text-ink">
                  {step.title}
                </p>
                <p className="font-serif text-3xl text-light leading-none">
                  {step.description}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              <p className="font-serif text-xl text-light p-2">{step.detail}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </section>
  );
}

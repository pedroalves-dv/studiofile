"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { HoverWord } from "@/components/ui/HoverWord";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function AnimatedParagraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
  };

  return (
    <motion.p
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.p>
  );
}

export default function BrandStory() {
  const [visible, setVisible] = useState(false);
  const [imgData, setImgData] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    imgRef.current.style.transform = `translate(${x - 128}px, ${y - 200}px)`;
  }, []);

  const pClassName =
    "z-10 text-4xl lg:text-7xl xl:text-8xl leading-[1] font-medium tracking-[-0.1rem] md:tracking-[-0.2rem] lg:tracking-[-0.3rem] xl:tracking-[-0.4rem] text-ink text-justify ligatures";

  return (
    <section className="relative overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Cursor-following hover image */}
      <div
        ref={imgRef}
        className="absolute top-0 left-0 pointer-events-none z-0 transition-opacity duration-100"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {imgData && (
          <img
            src={imgData.src}
            alt={imgData.alt}
            className="max-w-md max-h-lg w-auto h-auto"
          />
        )}
      </div>

      {/* Paragraph 1 */}
      <div className="section-height flex items-center px-5">
        <AnimatedParagraph className={pClassName}>
          We are a design studio founded in{" "}
          <HoverWord
            href="/about"
            src="/images/page/paris-studio.jpg"
            alt="Our Paris studio"
            onHover={(src, alt) => {
              setImgData({ src, alt });
              setVisible(true);
            }}
            onLeave={() => setVisible(false)}
          >
            Paris
          </HoverWord>
          , specializing in modular furniture and functional home decor
          solutions, created through{" "}
          <HoverWord
            href="/process"
            src="/images/page/3d-printing1.jpg"
            alt="3D printing process"
            onHover={(src, alt) => {
              setImgData({ src, alt });
              setVisible(true);
            }}
            onLeave={() => setVisible(false)}
          >
            3D printing
          </HoverWord>
          .
        </AnimatedParagraph>
      </div>

      {/* Paragraph 2 */}
      <div className="section-height flex items-center px-5">
        <AnimatedParagraph className={pClassName}>
          Our objects blend{" "}
          <span className="text-accent">architectural thinking</span> with a
          strong <span className="text-success pl-1">craft focus</span>,
          resulting in pieces that are conceptually rigorous and positively
          human.
        </AnimatedParagraph>
      </div>

      {/* Paragraph 3 */}
      <div className="section-height flex items-center px-5">
        <AnimatedParagraph className={pClassName}>
          Each piece is{" "}
          <HoverWord
            href="/process"
            src="/images/page/made-to-order.jpg"
            alt="Made to order process"
            onHover={(src, alt) => {
              setImgData({ src, alt });
              setVisible(true);
            }}
            onLeave={() => setVisible(false)}
          >
            made to order
          </HoverWord>
          , ensuring minimal waste. We work with eco-sourced materials to create{" "}
          <span className="text-error">meaningful objects</span> designed to be
          lived with, repaired, and upgraded.
        </AnimatedParagraph>
      </div>
    </section>
  );
}

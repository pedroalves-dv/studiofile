"use client";

import { useState, useRef, useCallback } from "react";
import { HoverWord } from "@/components/ui/HoverWord";

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

  return (
    <section
      className="relative flex items-center min-h-dvh border border-red-500"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor-following hover image — behind text */}
      <div
        ref={imgRef}
        className="absolute top-0 left-0 pointer-events-none z-0 transition-opacity duration-100"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {imgData && (
          <img
            src={imgData.src}
            alt={imgData.alt}
            className="max-w-96 max-h-96 w-auto h-auto"
          />
        )}
      </div>

      <div className="flex-1 h-full flex justify-center items-center px-2 border border-blue-500">
        <div className="flex flex-col gap-8 z-10 md:w-3/4 lg:max-w-[65rem]">
          {/* Story text */}
          <div className="flex flex-col gap-8">
            <p className="font-serif text-4xl text-light leading-none text-justify tracking-(space-xsm)">
              {/* <span className="font-display tracking-tighter text-ink">STUDIO</span>
              <span className="font-logoserif tracking-tight text-ink mr-2">filé</span> */}
              <span className="italic mr-3 text-ink text-4xl">STUDIO filé</span>{" "}
              is a design studio founded in{" "}
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
              , specializing in{" "}
              <HoverWord
                href="/shop"
                src="/images/page/modular-furniture.jpg"
                alt="Modular furniture"
                onHover={(src, alt) => {
                  setImgData({ src, alt });
                  setVisible(true);
                }}
                onLeave={() => setVisible(false)}
              >
                modular furniture
              </HoverWord>{" "}
              and functional home decor solutions, created through{" "}
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
            </p>

            <p className="font-serif text-4xl text-light leading-none text-justify tracking-(space-xsm)">
              Our objects blend{" "}
              <span className="text-accent">architectural thinking</span> with a
              strong <span className="text-success pl-1">craft focus</span>,
              resulting in pieces that are conceptually rigorous and positively
              human.
            </p>

            <p className="font-serif text-4xl text-light leading-none text-justify tracking-(space-xsm)">
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
              , ensuring minimal waste and maximum customization. We work with
              eco-sourced materials to create{" "}
              <span className="text-error">meaningful objects</span> designed to
              be lived with, repaired, and loved for years to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

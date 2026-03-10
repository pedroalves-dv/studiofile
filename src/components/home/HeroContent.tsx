"use client";

import { ArrowButton } from "@/components/ui/ArrowButton";

export function HeroContent() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h1
          className="font-display text-6xl sm:text-8xl leading-none 
          text-ink tracking-tight mt-20 "
        >
          TOTEM <span className="inline-block align-top font-mono text-xl 
          sm:text-2xl mt-1 -ml-2 sm:-ml-3 sm:mt-2">©</span>
        </h1>

        <ArrowButton
          href="/shop"
          label="Shop"
          glowColor="var(--color-black)"
          className="mt-12 sm:ml-[22rem] h-12 w-24 px-8 py-3 bg-ink text-canvas text-xs 
          tracking-display font-mono rounded-xl flex items-center 
          justify-center self-start"
        />
      </div>
      
      <p className=" mt-36 font-serif text-5xl sm:text-6xl text-light text-right md:w-3/4 
      lg:w-2/3 self-end tracking-(space-xsm)"
      >
        Introducting<span className="inline-block italic text-ink px-3"> TOTEM</span>, a fully modular lamp
        that adapts to you.
      </p>
      
    </div>
  );
}

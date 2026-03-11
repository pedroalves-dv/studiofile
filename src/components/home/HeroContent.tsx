"use client";

import { ArrowButton } from "@/components/ui/ArrowButton";

export function HeroContent() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {/* <h1
          className="font-display text-6xl sm:text-8xl leading-none 
          text-ink tracking-tight mt-20"
        >
          TOTEM{" "}
          <span
            className="inline-block align-top font-mono text-xl 
          sm:text-2xl mt-1 -ml-2 sm:-ml-3 sm:mt-2"
          >
            ©
          </span>
        </h1> */}

        <h1 className="mt-20 flex flex-col items-center leading-none text-ink 
        text-9xl sm:text-10xl font-display w-fit 
        -space-y-4 sm:-space-y-6 mx-auto">
          <span>T</span>
          <span>O</span>
          <span>T</span>
          <span>E</span>
          <span>M</span>
        </h1>

        <ArrowButton
          href="/shop"
          label="Shop"
          glowColor="var(--color-black)"
          className="mt-12 sm:ml-[22rem] h-12 w-24 px-8 py-3 bg-ink text-white text-xs 
          tracking-display font-mono rounded-xl flex items-center 
          justify-center self-start mx-auto"
        />
      </div>

      <p
        className="mt-44 font-serif text-5xl sm:text-6xl text-light text-right md:w-3/4 
      lg:w-2/3 self-end tracking-(space-xsm)"
      >
        Introducting
        <span
          className="inline-block font-display tracking-tight text-[4.2rem] 
        text-ink pl-4 pr-2"
        >
          {" "}
          TOTEM
        </span>
        , a fully <span className="italic text-ink pr-3">modular lamp</span>
        that adapts to you.
      </p>
    </div>
  );
}

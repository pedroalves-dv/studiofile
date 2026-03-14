import Image from "next/image";

export function ProductSpotlight() {
  return (
    <section className="relative w-full h-dvh overflow-hidden border border-blue-500">
      <Image
        src="/images/hero/totem-3.png"
        alt="TOTEM"
        sizes="100vw"
        fill
        className="object-cover"
      />

      <div className="relative h-full flex items-center justify-center">
        <p
          className="font-serif text-5xl sm:text-6xl text-white text-right md:w-3/4
          lg:w-2/3 self-center"
        >
          Introducing
          <span className="inline-block font-display tracking-tight text-[4.2rem] text-ink pl-4 pr-2">
            {" "}
            TOTEM
          </span>
          , a fully <span className="italic text-ink pr-3">
            modular lamp
          </span>{" "}
          that adapts to you.
        </p>
      </div>
    </section>
  );
}

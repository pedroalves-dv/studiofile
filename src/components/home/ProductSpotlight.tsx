import Image from "next/image";

export function ProductSpotlight() {
  return (
    <section className="relative w-full h-dvh overflow-hidden section-centered border border-blue-500">
      <div className="relative flex-1 bg-error">
        <div className="relative h-full flex items-center justify-center">
          <p
            className="font-mono tracking-[-10px] text-xl sm:text-8xl text-white text-right md:w-3/4
          lg:w-2/3 self-center"
          >
            Introducing
            <span className="inline-block font-display tracking-tighter text-9xl text-accent pl-4 pr-2">
              {" "}
              TOTEM
            </span>
            , a fully{" "}
            <span className="tracking-[-5px] italic text-ink pr-3">
              modular lamp
            </span>{" "}
            that adapts to you.
          </p>
        </div>
      </div>
    </section>
  );
}

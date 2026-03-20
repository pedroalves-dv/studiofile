import Image from "next/image";

export function ProductSpotlight() {
  return (
    <section className="relative w-full h-dvh overflow-hidden section-centered border border-blue-500">
      <div className="relative flex-1 bg-error">
        <div className="relative h-full flex items-center justify-center">
          <p
            className="font-body tracking-[-7px] text-4xl sm:text-8xl text-white md:w-3/4
          lg:w-2/3 self-center"
          >
            Introducing
            <span className="inline-block font-display tracking-tighter text-10xl text-black pl-4 pr-2">
              {" "}
              TOTEM
            </span>
            , a fully{" "}
            <span className="text-black tracking-[-7px] font-bold">
              modular lamp
            </span>{" "}
            that adapts to you.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FooterBackground() {
  return (
    // <section
    //   className="w-full md:h-[30rem] flex flex-col justify-center
    // items-center overflow-hidden"
    // >
    <section className="absolute bottom-0 left-0 right-0 w-full ">
      <div className="flex items-end h-full z-0">
        <div
          className="w-full bg-accent"
          style={{
            aspectRatio: "22.203955 / 4.0943561",
            maskImage: "url(/images/logo/newlogov1.svg)",
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>
      {/* Mobile */}
      {/* <div
        className="sm:hidden w-96 bg-accent"
        style={{
          aspectRatio: "43.710445 / 237.04541",
          maskImage: "url(/images/logo/logo-large-vertical.svg)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center left",
        }}
      /> */}

      {/* md+ */}
      {/* <div className="hidden sm:block w-full flex flex-col  md:items-center">
        <div
          className="w-full bg-accent"
          style={{
            aspectRatio: "237.04541 / 43.710445",
            maskImage: "url(/images/logo/logo-large-horizontal.svg)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div> */}
    </section>
  );
}

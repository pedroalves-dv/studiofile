export function FooterBackground() {
  return (
    <section
      className="w-full h-full flex justify-center 
    items-center mt-60"
    >
      {/* Mobile */}
      <div
        className="sm:hidden w-96 bg-accent"
        style={{
          aspectRatio: "43.710445 / 237.04541",
          maskImage: "url(/images/logo/logo-large-vertical.svg)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center left",
        }}
      />
      {/* Tablet/Desktop */}
      <div className="hidden sm:block w-full flex flex-col items-center">
        <div
          className="w-full bg-success mb-14"
          style={{
            aspectRatio: "237.04541 / 43.710445",
            maskImage: "url(/images/logo/logo-large-horizontal.svg)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>
    </section>
  );
}

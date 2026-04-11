export function FooterBackground() {
  return (
    <section className="absolute bottom-0 left-0 right-0 w-full contain-paint transform-gpu">
      <div className="flex items-end h-full z-0">
        {/* OPTIMIZED: Replaced mask-image with a standard image tag */}
        {/* If the SVG needs to be a specific color, ensure the raw SVG file has that fill color, 
            or use an inline <svg className="fill-accent w-full" ... /> instead of an img tag. */}
        <img
          src="/images/logo/newlogov1.svg"
          alt="Studio Filé Logo Background"
          className="w-full select-none"
          style={{
            aspectRatio: "22.203955 / 4.0943561",
            objectFit: "contain",
            objectPosition: "center",
          }}
          // loading="lazy" // Optional: helps initial load times if the footer is far down
        />
      </div>
    </section>
  );
}

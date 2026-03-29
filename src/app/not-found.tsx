import { ArrowButton } from "@/components/ui/ArrowButton";

export default function NotFound() {
  return (
    <div className="section-centered bg-canvas flex flex-col items-center justify-center px-6 -mt-12">
      <h1 className="text-[20vw] font-semibold tracking-tighter leading-none text-lighter mb-8">
        404
      </h1>
      <div className="text-center max-w-md mb-8">
        <h2 className="text-6xl font-medium tracking-tighter leading-tight text-ink mb-4">
          Page not found.
        </h2>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <div className="flex gap-4">
        <ArrowButton
          href="/"
          label="Back to Home"
          className="w-fit mt-4 px-6 py-2 bg-ink text-white text-base font-medium tracking-tight rounded-md  border border-stroke  disabled:opacity-50"
        />
      </div>
    </div>
  );
}

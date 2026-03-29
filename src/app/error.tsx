"use client";

import { useEffect } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Error boundary caught:", error);
    }
  }, [error]);

  return (
    <div className="section-centered bg-canvas flex flex-col items-center justify-center px-6 -mt-12">
      <h1 className="text-4xl tracking-tighter leading-tight text-ink mb-4">
        Something went wrong
      </h1>
      <p className="text-muted mb-8">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-4 justify-center">
        <ArrowButton
          label="Try again"
          onClick={() => reset()}
          className="w-fit mt-4 px-6 py-2 bg-ink text-white text-base font-medium tracking-tight rounded-md  border border-stroke  disabled:opacity-50"
        />
        <ArrowButton
          href="/"
          label="Back to Home"
          className="w-fit mt-4 px-6 py-2 bg-canvas text-ink text-base font-medium tracking-tight rounded-md  border border-stroke  disabled:opacity-50"
        />
      </div>
    </div>
  );
}

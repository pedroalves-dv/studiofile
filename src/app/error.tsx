"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

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
    <div className="section-padding container-narrow text-center">
      <h1 className="font-display text-3xl text-ink mb-4">
        Something went wrong
      </h1>
      <p className="text-muted mb-8">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="primary" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

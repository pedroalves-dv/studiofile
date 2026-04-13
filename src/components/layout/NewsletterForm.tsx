// src/components/layout/NewsletterForm.tsx
"use client";

import { useState } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Input } from "@/components/ui/Input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="newsletter-email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className=""
      />

      <ArrowButton
        label="Stay in the loop"
        type="submit"
        className="btn btn-normal w-full mt-4 bg-white text-ink border border-ink disabled:btn-disabled"
      />
    </form>
  );
}

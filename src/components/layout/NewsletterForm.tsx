"use client";

import { useState } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-stroke rounded-md focus-within:border-ink transition-colors">
        <input
          id="newsletter-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 bg-transparent text-ink text-sm font-mono tracking-tight placeholder-light focus:outline-none"
          required
        />
      </div>

      <ArrowButton
        label="Subscribe"
        type="submit"
        className="w-full mt-4 px-6 py-2 bg-white text-ink text-base font-medium tracking-[-0.04em] rounded-md flex items-center border border-ink justify-center disabled:opacity-50"
      />
    </form>
  );
}

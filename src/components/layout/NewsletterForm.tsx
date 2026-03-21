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
      <input
        type="email"
        aria-label="Email address"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 bg-canvas border rounded-xl border-stroke 
        text-ink placeholder-light text-lg tracking-tighter focus:outline-none focus:border-muted 
        transition-colors"
        required
      />
      <ArrowButton
        label="Subscribe"
        type="submit"
        glowColor="var(--color-black)"
        className="w-full py-2.5 bg-ink text-canvas font-mono tracking-wide
         text-sm rounded-xl border border-white"
      />
    </form>
  );
}

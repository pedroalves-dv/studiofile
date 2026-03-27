"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export function LandingSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 1800);
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="py-10 text-center">
        <span className="block text-accent text-3xl mb-5">✦</span>
        <p className="font-display text-ink text-2xl mb-3">
          You&apos;re on the list.
        </p>
        <p className="text-muted text-md tacking-tight">
          We&apos;ll send your 30% code when TOTEM launches.
          <br />
          Thank you for being here early.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="landing-name"
          className="text-md tracking-tight  text-muted"
        >
          Your name <span className="text-ink/30">(optional)</span>
        </label>
        <input
          id="landing-name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Marie Dupont"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border border-stroke text-ink text-md tracking-tight
            px-4 py-3 placeholder:text-muted/60
            focus:outline-none focus:border-accent
            transition-colors duration-200 rounded-lg"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="landing-email"
          className="text-md tracking-tight  text-muted"
        >
          Email address
        </label>
        <input
          id="landing-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full bg-transparent border text-ink text-md tracking-tight
            px-4 py-3 placeholder:text-muted/60
            focus:outline-none transition-colors duration-200 rounded-lg
            ${emailError ? "border-error" : "border-stroke focus:border-accent"}`}
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full bg-accent text-black text-md tracking-tight
           py-4 mt-1
          hover:bg-accent/90 active:scale-[0.99]
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
      >
        {state === "loading" ? "Sending…" : "Notify me at launch →"}
      </button>

      {state === "error" && (
        <p className="text-md text-error tracking-tight">
          Something went wrong. Please try again.
        </p>
      )}

      <p className="text-md text-muted/70 tracking-tight mt-1">
        No spam. One email when we launch — your 30% code included.
      </p>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { customerLogin } from "@/lib/shopify/auth";
import { Input } from "@/components/ui/Input";
import { ArrowButton } from "@/components/ui/ArrowButton";

interface LoginFormProps {
  nextPath: string;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await customerLogin(email, password);
      if (result.success) {
        router.push(nextPath);
      } else {
        setError(result.error ?? "Login failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error && (
        <p className="text-error text-xs border border-error/30 bg-error/5 px-4 py-3">
          {error}
        </p>
      )}

      <Input
        label="Email"
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        disabled={isPending}
        required
      />

      <div className="space-y-1">
        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={isPending}
          required
        />
        <div className="flex justify-end px-1">
          <Link
            href="/account/forgot-password"
            className="text-base text-light hover:text-ink transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <ArrowButton
        type="submit"
        label={isPending ? "Signing in…" : "Sign in"}
        disabled={isPending}
        className="w-full btn btn-normal bg-ink text-white border border-ink/20"
      />

      <ArrowButton
        label="Create Account"
        href="/account/register"
        className="w-full btn btn-normal bg-white text-ink border border-stroke"
      />
    </form>
  );
}

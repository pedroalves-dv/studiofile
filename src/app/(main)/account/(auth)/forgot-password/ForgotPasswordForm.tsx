'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { sendPasswordReset } from '@/lib/shopify/auth'

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await sendPasswordReset(email)
        setSubmitted(true)
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink border border-stroke bg-canvas px-4 py-3">
          If an account exists for this email, you&apos;ll receive a reset link shortly.
        </p>
        <Link
          href="/account/login"
          className="text-label text-muted hover:text-ink transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-label text-muted">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isPending}
          className="w-full border border-stroke bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-ink text-canvas py-3 text-label hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send reset link'}
      </button>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <Link
        href="/account/login"
        className="text-sm text-muted text-center hover:text-ink transition-colors"
      >
        ← Back to sign in
      </Link>
    </form>
  )
}

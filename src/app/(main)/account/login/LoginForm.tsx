'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { customerLogin } from '@/lib/shopify/auth'

interface LoginFormProps {
  nextPath: string
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await customerLogin(email, password)
      if (result.success) {
        router.push(nextPath)
      } else {
        setError(result.error ?? 'Login failed')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="text-sm text-error border border-error/30 bg-error/5 px-4 py-3">
          {error}
        </p>
      )}

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

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-label text-muted">Password</label>
          <Link href="/account/forgot-password" className="text-xs text-muted hover:text-ink transition-colors">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isPending}
          className="w-full border border-stroke bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-ink text-canvas py-3 text-label hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-sm text-muted text-center">
        Don&apos;t have an account?{' '}
        <Link href="/account/register" className="text-ink hover:text-accent transition-colors">
          Create one
        </Link>
      </p>
    </form>
  )
}

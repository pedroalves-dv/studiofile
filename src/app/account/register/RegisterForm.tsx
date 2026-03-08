'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { customerRegister } from '@/lib/shopify/auth'

export function RegisterForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const result = await customerRegister(firstName, lastName, email, password)
      if (result.success) {
        router.push('/account')
      } else {
        setError(result.error ?? 'Registration failed')
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

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="firstName" className="text-label text-muted">First name</label>
          <input
            id="firstName"
            type="text"
            required
            autoComplete="given-name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={isPending}
            className="w-full border border-stroke bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
            placeholder="First"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="lastName" className="text-label text-muted">Last name</label>
          <input
            id="lastName"
            type="text"
            required
            autoComplete="family-name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={isPending}
            className="w-full border border-stroke bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
            placeholder="Last"
          />
        </div>
      </div>

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
        <label htmlFor="password" className="text-label text-muted">Password</label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isPending}
          className="w-full border border-stroke bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
          placeholder="Min. 8 characters"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-label text-muted">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
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
        {isPending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-sm text-muted text-center">
        Already have an account?{' '}
        <Link href="/account/login" className="text-ink hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}

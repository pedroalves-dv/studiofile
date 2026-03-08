import type { Metadata } from 'next'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Reset Password' }
}

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="w-full max-w-md px-6 py-12">
        <h1 className="font-display text-3xl text-ink mb-4">Reset password</h1>
        <p className="text-sm text-muted mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <ForgotPasswordForm />
      </div>
    </main>
  )
}

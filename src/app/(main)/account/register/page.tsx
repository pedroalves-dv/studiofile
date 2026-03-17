import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Create Account' }
}

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="w-full max-w-md px-6 py-12">
        <h1 className="font-display text-3xl text-ink mb-8">Create account</h1>
        <RegisterForm />
      </div>
    </main>
  )
}

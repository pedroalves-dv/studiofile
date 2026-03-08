import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Login' }
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams
  const nextPath = next ?? '/account'
  return (
    <main className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="w-full max-w-md px-6 py-12">
        <h1 className="font-display text-3xl text-ink mb-8">Sign in</h1>
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  )
}

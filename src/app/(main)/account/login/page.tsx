import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Login" };
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next ?? "/account";
  return (
    <main className="flex pt-12 justify-center section-height px-6">
      <div className="w-full max-w-md">
        <h1 className="text-[5.2rem] sm:text-9xl tracking-tighter pb-8 sm:-ml-[10px] leading-[5rem]">
          Sign in
        </h1>
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}

import LoginForm from '#/components/auth/login'
import { Card } from '#/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { Waves, ShieldCheck, Leaf } from 'lucide-react'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decorations */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#4FB8B2]/20 blur-[100px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#2F6A4A]/10 blur-[100px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#328F97_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="relative z-10 w-full max-w-md rise-in">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#4FB8B2]/30 bg-white/70 shadow-[0_12px_35px_rgba(50,143,151,0.18)] backdrop-blur-xl">
            <Waves className="h-8 w-8 text-[#328F97]" />
          </div>

          <p className="island-kicker mb-2">Survey Management Platform</p>

          <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--sea-ink)]">
            Welcome back
          </h1>

          <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--sea-ink-soft)]">
            Sign in to your account and continue managing your surveys,
            responses, and insights.
          </p>
        </div>

        {/* Login card */}
        <Card className="gap-0 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] p-0 shadow-[0_25px_70px_rgba(23,58,64,0.13)] backdrop-blur-xl">
          {/* Card header */}
          <div className="border-b border-[var(--line)] px-7 py-5 sm:px-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4FB8B2]/15">
                <ShieldCheck className="h-5 w-5 text-[#328F97]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[var(--sea-ink)]">
                  Admin sign in
                </h2>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  Access your dashboard securely
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-9">
            <LoginForm />
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-center gap-2 border-t border-[var(--line)] bg-[var(--sand)]/40 px-6 py-4">
            <ShieldCheck className="h-3.5 w-3.5 text-[#328F97]" />
            <p className="text-xs text-[var(--sea-ink-soft)]">
              Your account is protected with secure authentication.
            </p>
          </div>
        </Card>

        {/* Bottom branding */}
        <div className="mt-7 flex items-center justify-center gap-2">
          <Leaf className="h-3.5 w-3.5 text-[#328F97]" />
          <p className="text-xs text-[var(--sea-ink-soft)]">
            Designed for better surveys and smarter insights.
          </p>
        </div>
      </div>
    </div>
  )
}

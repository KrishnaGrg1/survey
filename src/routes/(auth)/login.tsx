import LoginForm from '#/components/auth/login'
import { Card } from '#/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { GitBranch } from 'lucide-react'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* background: soft amber glow + faint dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#E8A838]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#2A2A3A_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative w-full max-w-sm">
        {/* brand + heading */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8A838]/30 bg-[#E8A838]/10 shadow-[0_0_24px_rgba(232,168,56,0.15)]">
            <GitBranch className="h-6 w-6 text-[#E8A838]" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F0E8]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#8B88A0]">
            Sign in to manage your surveys
          </p>
        </div>

        <Card className="gap-0 overflow-hidden rounded-2xl border-border bg-card py-0 shadow-2xl">
          <div className="p-6 sm:p-8">
            <LoginForm />
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-[#4A4860]">
          Admin access only
        </p>
      </div>
    </div>
  )
}

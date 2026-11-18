import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { AlertCircle, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'

import { Alert, AlertDescription } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import { cn } from '#/lib/utils'
import { useLogin } from '#/hooks/use-auth'

const inputClass = (hasError: boolean) =>
  cn(
    'h-12 w-full rounded-xl border bg-[var(--surface)] pl-11 pr-11',
    'text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/50',
    'transition-all duration-200 outline-none',
    hasError
      ? 'border-red-400 focus-visible:ring-2 focus-visible:ring-red-400/20'
      : 'border-[var(--line)] hover:border-[#4FB8B2]/60 focus-visible:border-[#328F97] focus-visible:ring-2 focus-visible:ring-[#4FB8B2]/20',
  )

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: login, isPending, error: loginError } = useLogin()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      login({
        email: value.email.trim(),
        password: value.password,
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      noValidate
      className="space-y-5"
    >
      {/* Server error */}
      {loginError && (
        <Alert className="rounded-xl border-red-300/60 bg-red-50/80">
          <AlertCircle className="h-4 w-4 text-red-600" />

          <AlertDescription className="text-sm text-red-700">
            {loginError.message || 'Invalid email or password.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Email */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Email is required'
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? 'Enter a valid email address'
                : undefined,
        }}
      >
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0

          return (
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-sm font-semibold text-[var(--sea-ink)]"
              >
                Email address
              </Label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#328F97]" />

                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  aria-invalid={hasError}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={inputClass(hasError)}
                />
              </div>

              {hasError && (
                <p className="text-xs text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Password */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Password is required' : undefined,
        }}
      >
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0

          return (
            <div className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-sm font-semibold text-[var(--sea-ink)]"
              >
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#328F97]" />

                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? 'text' : 'password'}
                  value={field.state.value}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={hasError}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={inputClass(hasError)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--sea-ink-soft)] transition-colors hover:text-[#328F97]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {hasError && (
                <p className="text-xs text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className={cn(
            'group h-12 w-full rounded-xl',
            'bg-gradient-to-r from-[#328F97] to-[#2F6A4A]',
            'text-sm font-bold text-white',
            'shadow-[0_8px_20px_rgba(50,143,151,0.2)]',
            'transition-all duration-300',
            'hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(50,143,151,0.3)]',
            'hover:from-[#287D85] hover:to-[#25583D]',
            'active:translate-y-0',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign in to dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>

      <p className="text-center text-xs leading-5 text-[var(--sea-ink-soft)]">
        By signing in, you agree to use this platform responsibly and keep your
        account credentials secure.
      </p>
    </form>
  )
}

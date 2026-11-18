import { useState } from 'react'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { cn } from '#/lib/utils'
import { useForm } from '@tanstack/react-form'
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useLogin } from '#/hooks/use-auth'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'

// Shared input styling: one place to change the look of every field
const inputClass = (hasError: boolean) =>
  cn(
    'h-11 w-full rounded-lg border bg-[#111118] pl-9 pr-3',
    'text-sm text-[#F5F0E8] placeholder:text-[#4A4860]',
    'transition-all duration-300 outline-none',
    hasError
      ? 'border-[#E05555]/60 focus-visible:border-[#E05555] focus-visible:ring-2 focus-visible:ring-[#E05555]/20'
      : 'border-[#2A2A3A] hover:border-[#3A3A50] focus-visible:border-[#E8A838] focus-visible:ring-2 focus-visible:ring-[#E8A838]/25',
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
      login({ email: value.email.trim(), password: value.password })
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
      className="w-full space-y-4"
    >
      {/* SERVER ERROR */}
      {loginError && (
        <Alert
          role="alert"
          className="rounded-lg border-[#E05555]/25 bg-[#E05555]/[0.06] px-3 py-2.5"
        >
          <AlertCircle className="h-4 w-4 text-[#E05555]" />
          <AlertDescription className="text-xs text-[#E05555]">
            {loginError.message || 'Invalid email or password'}
          </AlertDescription>
        </Alert>
      )}

      {/* EMAIL */}
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
          // only show an error after the user has left the field (or tried to submit)
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0

          return (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="block text-xs font-medium text-[#B8B5C5]"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A4860]" />
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  aria-invalid={hasError}
                  aria-describedby={
                    hasError ? `error-${field.name}` : undefined
                  }
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={inputClass(hasError)}
                />
              </div>
              {hasError && (
                <p
                  id={`error-${field.name}`}
                  className="text-left text-[11px] text-[#E05555]"
                >
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* PASSWORD */}
      <form.Field
        name="password"
        validators={{
          // login only checks "not empty"; the server decides if it is correct
          onChange: ({ value }) =>
            !value ? 'Password is required' : undefined,
        }}
      >
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0

          return (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="block text-xs font-medium text-[#B8B5C5]"
              >
                Password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A4860]" />
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? 'text' : 'password'}
                  value={field.state.value}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={hasError}
                  aria-describedby={
                    hasError ? `error-${field.name}` : undefined
                  }
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={cn(inputClass(hasError), 'pr-10')}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-[#4A4860] transition-colors duration-200 hover:text-[#B8B5C5] focus-visible:text-[#E8A838] focus-visible:outline-none"
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
                <p
                  id={`error-${field.name}`}
                  className="text-left text-[11px] text-[#E05555]"
                >
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* BUTTON */}
      <div className="pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className={cn(
            'h-11 w-full cursor-pointer rounded-lg',
            'text-sm font-semibold',
            'bg-[#E8A838] text-[#0A0A0F]',
            'hover:bg-[#F0B848]',
            'transition-all duration-300',
            'hover:-translate-y-0.5',
            'hover:shadow-[0_6px_20px_rgba(232,168,56,0.28)]',
            'active:translate-y-0 active:scale-[0.98]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A838] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16161F]',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F]" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </Button>
      </div>
    </form>
  )
}

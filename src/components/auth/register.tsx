import { useState } from 'react'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { cn } from '#/lib/utils'
import { useForm } from '@tanstack/react-form'
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useRegister } from '#/hooks/use-auth'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Typography } from '../ui/typography'

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

const iconClass =
  'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A4860]'

const toggleClass =
  'absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded text-[#4A4860] transition-colors duration-200 hover:text-[#B8B5C5] focus-visible:text-[#E8A838] focus-visible:outline-none'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutate: register, isPending, error: registerError } = useRegister()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...registerData } = value
      register({
        ...registerData,
        name: registerData.name.trim(),
        email: registerData.email.trim(),
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
      className="w-full space-y-4"
    >
      {/* SERVER ERROR */}
      {registerError && (
        <Alert
          role="alert"
          className="rounded-lg border-[#E05555]/25 bg-[#E05555]/[0.06] px-3 py-2.5"
        >
          <AlertCircle className="h-4 w-4 text-[#E05555]" />
          <AlertDescription>
            <Typography variant="caption" className="text-[#E05555]">
              {registerError.message ||
                'Something went wrong. Please try again.'}
            </Typography>
          </AlertDescription>
        </Alert>
      )}

      {/* USERNAME */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value.trim()
              ? 'Username is required'
              : value.trim().length < 3
                ? 'Username must be at least 3 characters'
                : undefined,
        }}
      >
        {(field) => {
          // only show an error after the user has left the field (or tried to submit)
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0
          return (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="block">
                <Typography
                  as="span"
                  variant="label"
                  className="text-[#B8B5C5]"
                >
                  Username
                </Typography>
              </Label>
              <div className="relative">
                <User className={iconClass} />
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  placeholder="johndoe"
                  autoComplete="username"
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
                <Typography
                  as="p"
                  id={`error-${field.name}`}
                  variant="caption"
                  className="text-left text-[#E05555]"
                >
                  {field.state.meta.errors[0]}
                </Typography>
              )}
            </div>
          )
        }}
      </form.Field>

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
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0
          return (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="block">
                <Typography
                  as="span"
                  variant="label"
                  className="text-[#B8B5C5]"
                >
                  Email
                </Typography>
              </Label>
              <div className="relative">
                <Mail className={iconClass} />
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  placeholder="you@example.com"
                  autoComplete="email"
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
                <Typography
                  as="p"
                  id={`error-${field.name}`}
                  variant="caption"
                  className="text-left text-[#E05555]"
                >
                  {field.state.meta.errors[0]}
                </Typography>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* PASSWORD */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Password is required'
              : value.length < 8
                ? 'Password must be at least 8 characters'
                : undefined,
        }}
      >
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0
          return (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="block">
                <Typography
                  as="span"
                  variant="label"
                  className="text-[#B8B5C5]"
                >
                  Password
                </Typography>
              </Label>
              <div className="relative">
                <Lock className={iconClass} />
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? 'text' : 'password'}
                  value={field.state.value}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                  onClick={() => setShowPassword((v) => !v)}
                  className={toggleClass}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {hasError ? (
                <Typography
                  as="p"
                  id={`error-${field.name}`}
                  variant="caption"
                  className="text-left text-[#E05555]"
                >
                  {field.state.meta.errors[0]}
                </Typography>
              ) : (
                <Typography
                  as="p"
                  variant="caption"
                  className="text-left text-[#4A4860]"
                >
                  Use at least 8 characters.
                </Typography>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* CONFIRM PASSWORD */}
      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) =>
            !value
              ? 'Please confirm your password'
              : value !== fieldApi.form.getFieldValue('password')
                ? 'Passwords do not match'
                : undefined,
        }}
      >
        {(field) => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0
          return (
            <div className="space-y-1.5">
              <Label htmlFor={field.name} className="block">
                <Typography
                  as="span"
                  variant="label"
                  className="text-[#B8B5C5]"
                >
                  Confirm password
                </Typography>
              </Label>
              <div className="relative">
                <Lock className={iconClass} />
                <Input
                  id={field.name}
                  name={field.name}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={field.state.value}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className={toggleClass}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {hasError && (
                <Typography
                  as="p"
                  id={`error-${field.name}`}
                  variant="caption"
                  className="text-left text-[#E05555]"
                >
                  {field.state.meta.errors[0]}
                </Typography>
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
              <Typography as="span" variant="h4" className="text-[#0A0A0F]">
                Creating account...
              </Typography>
            </span>
          ) : (
            <Typography as="span" variant="h4" className="text-[#0A0A0F]">
              Create account
            </Typography>
          )}
        </Button>
      </div>
    </form>
  )
}

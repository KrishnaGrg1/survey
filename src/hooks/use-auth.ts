import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { signIn, signUp } from '#/lib/server-fn-services/auth.service'

export function useLogin() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate({ to: '/admin/surveys' })
      toast.success('Login successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: '/admin/surveys' })
      toast.success('Register successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

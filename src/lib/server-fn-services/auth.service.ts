import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import { authClient } from '../auth-client'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    return session
  },
)

export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return session
  },
)
export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  await auth.api.signOut({
    headers: getRequestHeaders(),
  })
})

export const signIn = async (data: { email: string; password: string }) => {
  try {
    const { data: result, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        success: false,
        message: error.message || 'Invalid email or password',
      }
    }
    console.log("data",result)

    return {
      success: true,
      data: result,
    }
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}
export const signUp = async (data: {
  name: string
  email: string
  password: string
}) => {
  try {
    const { data: result, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        success: false,
        message: error.message || 'Failed to create account',
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}

import axios from 'axios'

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api'
  }

  const serverOrigin =
    process.env.APP_URL ||
    process.env.PUBLIC_APP_URL ||
    process.env.VITE_APP_URL ||
    process.env.URL ||
    'http://localhost:3000'

  try {
    return new URL('/api', serverOrigin).toString().replace(/\/$/, '')
  } catch {
    return 'http://localhost:3000/api'
  }
}

export const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})



export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  const responseData = (error as any)?.response?.data
  const apiMessage =
    responseData?.error?.details ||
    responseData?.message ||
    responseData?.error?.message ||
    (error as any)?.message ||
    fallback

  return apiMessage || fallback
}
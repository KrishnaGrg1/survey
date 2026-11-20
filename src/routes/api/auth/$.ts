import { ratelimit } from '#/lib/rate-limit'
import { auth } from '#/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

async function handleAuthRequest({ request }: { request: Request }) {
  // Get client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  // Separate limits for different auth endpoints
  const pathname = new URL(request.url).pathname
  const identifier = `${ip}:${pathname}`

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)

  // Rate limit exceeded
  if (!success) {
    return Response.json(
      {
        success: false,
        message: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'Retry-After': String(
            Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
          ),
        },
      },
    )
  }

  return auth.handler(request)
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
    },
  },
})

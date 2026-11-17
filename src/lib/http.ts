import { z, ZodError } from 'zod'

export type Ctx = { request: Request; params: Record<string, string> }

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string>,
  ) {
    super(message)
  }
}

export const ok = (
  data: unknown = null,
  message = 'OK',
  status = 200,
  headers?: HeadersInit,
) => Response.json({ success: true, message, data }, { status, headers })

const fail = (
  status: number,
  message: string,
  errors?: Record<string, string>,
) => Response.json({ success: false, message, errors }, { status })

const MAX_BODY_BYTES = 200_000

export async function parseBody<S extends z.ZodType>(
  request: Request,
  schema: S,
): Promise<z.output<S>> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES)
    throw new ApiError(413, 'Request body too large')
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON')
  }
  return schema.parse(raw)
}

export function parseQuery<S extends z.ZodType>(
  request: Request,
  schema: S,
): z.output<S> {
  return schema.parse(Object.fromEntries(new URL(request.url).searchParams))
}

// A malformed id can never exist, so treat it as 404 instead of letting Prisma throw
export function parseId(id: string | undefined): string {
  if (!id || !z.string().uuid().safeParse(id).success)
    throw new ApiError(404, 'Not found')
  return id
}

// Wraps every handler: one place for status codes and error shapes
export const handle =
  (fn: (ctx: Ctx) => Promise<Response>) =>
  async (ctx: Ctx): Promise<Response> => {
    try {
      return await fn(ctx)
    } catch (e: any) {
      if (e instanceof ApiError) return fail(e.status, e.message, e.errors)
      if (e instanceof ZodError)
        return fail(
          422,
          'Validation failed',
          Object.fromEntries(
            e.issues.map((i) => [i.path.join('.') || 'body', i.message]),
          ),
        )
      if (e?.code === 'P2025') return fail(404, 'Not found') // Prisma: record missing
      if (e?.code === 'P2002') return fail(409, 'Already exists') // Prisma: unique violation
      console.error(e)
      return fail(500, 'Internal server error')
    }
  }

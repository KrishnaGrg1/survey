import { prisma } from '#/db'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await prisma.$queryRaw`SELECT 1`
        return Response.json({
          success: true,
          message: 'Status healthy',
        })
      },
    },
  },
})

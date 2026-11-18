import { prisma } from '#/db'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/surveys/$slug/')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { slug } = params

          const survey = await prisma.survey.findUnique({
            where: { slug },
            include: {
              versions: {
                orderBy: { version: 'desc' },
              },
            },
          })

          if (!survey) {
            return Response.json(
              {
                success: false,
                message: 'Survey not found',
              },
              { status: 404 },
            )
          }

          return Response.json({
            success: true,
            message: 'Survey fetched successfully',
            data: survey,
          })
        } catch (error) {
          console.error('GET survey error:', error)

          return Response.json(
            {
              success: false,
              message: 'Internal server error',
            },
            { status: 500 },
          )
        }
      },
    },
  },
})

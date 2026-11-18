import { prisma } from '#/db'

import { ensureSession } from '#/lib/server-fn-services/auth.service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/surveys/$id/publish')({
  server: {
    handlers: {
      // publish survery
      POST: async ({ params }) => {
        try {
          await ensureSession()
          const { id } = params
     
          const survey = await prisma.survey.findUnique({
            where: { id },
          })
          if (!survey) {
            throw new Error('Survey not found to publish')
          }
          const updatedSurvey = await prisma.survey.update({
            where: { id },
            data: {
              status: survey.status === 'published' ? 'draft' : 'published',
            },
          })
          return Response.json({
            success: true,
            message:
              survey.status === 'published'
                ? 'survey unpublished successfully'
                : 'published survey successfully',
            data: updatedSurvey,
          })
        } catch (error) {
          console.error('POST survey error:', error)

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

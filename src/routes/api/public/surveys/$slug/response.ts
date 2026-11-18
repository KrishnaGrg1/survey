import { prisma } from '#/db'
import type { Prisma } from '#/generated/prisma/client'
import { submitSurveySchema } from '#/lib/schema/public.survery'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/surveys/$slug/response')({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        try {
          const { slug } = params

          let body: unknown

          try {
            body = await request.json()
          } catch {
            return Response.json(
              {
                success: false,
                message: 'Invalid JSON body',
              },
              { status: 400 },
            )
          }

          const result = submitSurveySchema.safeParse(body)

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: 'Validation failed',
                errors: result.error.flatten(),
              },
              { status: 400 },
            )
          }

          const version = await prisma.surveyVersion.findFirst({
            where: {
              id: result.data.surveyVersionId,
              surveyId: result.data.surveyId,
              survey: {
                slug,
              },
            },
          })

          if (!version) {
            return Response.json(
              {
                success: false,
                message: 'Survey or survey version not found',
              },
              { status: 404 },
            )
          }

          const response = await prisma.response.create({
            data: {
              surveyId: result.data.surveyId,
              surveyVersionId: result.data.surveyVersionId,
              answers: result.data.answers as Prisma.InputJsonObject,
            },
          })

          return Response.json(
            {
              success: true,
              message: 'Survey submitted successfully',
              data: {
                id: response.id,
                submittedAt: response.submittedAt,
              },
            },
            { status: 201 },
          )
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

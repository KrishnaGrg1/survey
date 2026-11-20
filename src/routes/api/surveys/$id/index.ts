import { prisma } from '#/db'
import { createSurveySchema } from '#/lib/schema/survey'
import { ensureSession } from '#/lib/server-fn-services/auth.service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/surveys/$id/')({
  server: {
    handlers: {
      // list survey by ID
      GET: async ({ params }) => {
        try {
          await ensureSession()
          const { id } = params

          const survey = await prisma.survey.findUnique({
            where: { id },
            include: {
              versions: {
                orderBy: { version: 'asc' },
              },
            },
          })
          return Response.json({
            success: true,
            message: 'Get survey successfully',
            data: survey,
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
      // update survey
      PUT: async ({ params, request }) => {
        try {
          await ensureSession()

          const { id } = params

          const body = await request.json().catch(() => null)

          if (!body) {
            return Response.json(
              {
                success: false,
                message: 'Request body is required',
              },
              { status: 400 },
            )
          }

          const result = createSurveySchema.safeParse(body)

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

          const survey = await prisma.survey.findUnique({
            where: { id },
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

          const updatedSurvey = await prisma.survey.update({
            where: { id },
            data: {
              title: result.data.title,
              slug: result.data.slug,
              description: result.data.description,
              currentVersion: { increment: 1 },
              versions: {
                create: {
                  version: survey.currentVersion + 1,
                  schema: {
                    questions: result.data.questions,
                  },
                },
              },
            },
            include: {
              versions: true,
            },
          })

          return Response.json({
            success: true,
            message: 'Updated survey successfully',
            data: updatedSurvey,
          })
        } catch (error) {
          console.error('PUT survey error:', error)

          return Response.json(
            {
              success: false,
              message: 'Internal server error',
            },
            { status: 500 },
          )
        }
      },

      // delete survey
      DELETE: async ({ params }) => {
        try {
          await ensureSession()
          const { id } = params

          const survey = await prisma.survey.findUnique({
            where: { id },
          })
          if (!survey) {
            return Response.json(
              {
                success: false,
                message: 'Survery not found',
              },
              { status: 404 },
            )
          }
          await prisma.survey.delete({
            where: { id },
          })
          return Response.json({
            success: true,
            message: 'deleted survey successfully',
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

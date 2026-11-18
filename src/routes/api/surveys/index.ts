import { prisma } from '#/db'
import { createSurveySchema } from '#/lib/schema/survey'
import { ensureSession } from '#/lib/server-fn-services/auth.service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/surveys/')({
  server: {
    handlers: {
      // GET all surveys
      GET: async () => {
        try {
          await ensureSession()

          const surveys = await prisma.survey.findMany({
            include: {
              _count: {
                select: {
                  responses: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })

          return Response.json({
            success: true,
            message: 'Surveys fetched successfully',
            data: surveys,
          })
        } catch (error) {
          console.error('GET surveys error:', error)

          return Response.json(
            {
              success: false,
              message: 'Internal server error',
            },
            { status: 500 },
          )
        }
      },

      // CREATE survey
      POST: async ({ request }) => {
        try {
          await ensureSession()

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

          const data = result.data

          const survey = await prisma.survey.create({
            data: {
              title: data.title,
              slug: data.slug,
              description: data.description,
              versions: {
                create: {
                  version: 1,
                  schema: {
                    questions: data.questions,
                  },
                },
              },
            },
            include: {
              versions: true,
            },
          })

          return Response.json(
            {
              success: true,
              message: 'Survey created successfully',
              data: survey,
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

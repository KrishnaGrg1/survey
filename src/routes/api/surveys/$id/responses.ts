import { prisma } from '#/db'
import { responseQuerySchema } from '#/lib/schema/anlaytic'

import { ensureSession } from '#/lib/server-fn-services/auth.service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/surveys/$id/responses')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          await ensureSession()
          const { id } = params
          const body = await request.json()

          body.id = id
          const result = responseQuerySchema.safeParse(params)
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
            where: { id: result.data.id },
            include: {
              versions: {
                orderBy: { version: 'desc' },
              },
              _count: {
                select: { responses: true },
              },
            },
          })

          if (!survey) {
            return Response.json(
              {
                success: false,
                message: 'Survey not found',
              },
              {
                status: 400,
              },
            )
          }
          const { page, limit, versionId } = result.data
          const where = {
            surveyId: id,
            ...(versionId ? { surveyVersionId: versionId } : {}),
          }
          const [responses, total] = await prisma.$transaction([
            prisma.response.findMany({
              where,
              select: {
                id: true,
                answers: true,
                submittedAt: true,
                surveyVersion: {
                  select: {
                    id: true,
                    version: true,
                  },
                },
              },
              orderBy: {
                submittedAt: 'desc',
              },
              skip: (page - 1) * limit,
              take: limit,
            }),

            prisma.response.count({ where }),
          ])

          return Response.json({
            success: true,
            data: {
              survey,
              responses,
              pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
              },
            },
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

import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db'

import type { questionSchema } from '../schema/survey'
import type { z } from 'zod'
import {
  responseQuerySchema,
  storedSurveySchema,
  surveyIdSchema,
} from '../schema/anlaytic'
import { ensureSession } from './auth.service'

export const getSurveyAnalytics = createServerFn({
  method: 'GET',
})
  .validator((data) => surveyIdSchema.parse(data))
  .handler(async ({ data }) => {
    await ensureSession()

    const survey = await prisma.survey.findUnique({
      where: { id: data.id },
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
      throw new Error('Survey not found')
    }

    const responses = await prisma.response.findMany({
      where: { surveyId: data.id },
      select: {
        answers: true,
        surveyVersionId: true,
      },
    })

    const versionSchemas = new Map(
      survey.versions.map((version) => {
        const parsed = storedSurveySchema.safeParse(version.schema)

        return [version.id, parsed.success ? parsed.data.questions : []]
      }),
    )

    // Group responses by question ID across survey versions.
    const questionStats = new Map<
      string,
      {
        question: z.infer<typeof questionSchema>
        totalAnswers: number
        values: unknown[]
      }
    >()

    for (const response of responses) {
      const questions = versionSchemas.get(response.surveyVersionId) ?? []

      const answers = response.answers as Record<string, unknown>

      for (const question of questions) {
        const answer = answers[question.id]

        if (answer === undefined || answer === null) continue

        const existing = questionStats.get(question.id)

        if (existing) {
          existing.totalAnswers++
          existing.values.push(answer)
        } else {
          questionStats.set(question.id, {
            question,
            totalAnswers: 1,
            values: [answer],
          })
        }
      }
    }

    const questionAnalytics = Array.from(questionStats.values()).map(
      ({ question, totalAnswers, values }) => {
        if (
          question.type === 'single_choice' ||
          question.type === 'multi_choice'
        ) {
          const counts = new Map<string, number>()

          for (const value of values) {
            const selected = Array.isArray(value) ? value : [value]

            for (const option of selected) {
              if (typeof option === 'string') {
                counts.set(option, (counts.get(option) ?? 0) + 1)
              }
            }
          }

          return {
            questionId: question.id,
            label: question.label,
            type: question.type,
            totalAnswers,
            distribution: question.options.map((option) => {
              const count = counts.get(option.id) ?? 0

              return {
                value: option.id,
                label: option.label,
                count,
                percentage: Number(((count / totalAnswers) * 100).toFixed(2)),
              }
            }),
          }
        }

        if (question.type === 'rating') {
          const ratings = values.filter(
            (value): value is number =>
              typeof value === 'number' &&
              Number.isInteger(value) &&
              value >= 1 &&
              value <= 5,
          )

          const total = ratings.reduce((sum, rating) => sum + rating, 0)

          return {
            questionId: question.id,
            label: question.label,
            type: question.type,
            totalAnswers: ratings.length,
            average:
              ratings.length > 0
                ? Number((total / ratings.length).toFixed(2))
                : 0,
            distribution: [1, 2, 3, 4, 5].map((rating) => ({
              value: rating,
              count: ratings.filter((value) => value === rating).length,
            })),
          }
        }

        return {
          questionId: question.id,
          label: question.label,
          type: question.type,
          totalAnswers,
          answers: values.filter(
            (value): value is string => typeof value === 'string',
          ),
        }
      },
    )

    return {
      success: true,
      data: {
        survey: {
          id: survey.id,
          title: survey.title,
          status: survey.status,
        },
        totalResponses: survey._count.responses,
        questionAnalytics,
      },
    }
  })

export const getSurveyResponses = createServerFn({
  method: 'GET',
})
  .validator((data) => responseQuerySchema.parse(data))
  .handler(async ({ data }) => {
    await ensureSession()

    const { id, page, limit, versionId } = data

    const survey = await prisma.survey.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
      },
    })

    if (!survey) {
      throw new Error('Survey not found')
    }

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

    return {
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
    }
  })

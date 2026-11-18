import { createServerFn } from '@tanstack/react-start'

import { prisma } from '#/db'
import {
  getSurveyBySlugSchema,
  submitSurveySchema,
} from '../schema/public.survery'
import type { Prisma } from '#/generated/prisma/client'

export const getSurveyByslug = createServerFn({ method: 'GET' })
  .validator((data) => getSurveyBySlugSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const surveys = await prisma.survey.findUnique({
        where: {
          slug: data.slug,
        },
        include: {
          versions: { orderBy: { version: 'desc' } },
        },
      })
      console.log('survery', surveys)
      return {
        success: true,
        message: 'Get survey successfully',
        data: surveys,
      }
    } catch (error: any) {
      console.error(
        'get survery error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })

export const submitSurvery = createServerFn({ method: 'POST' })
  .validator((data) => submitSurveySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const version = await prisma.surveyVersion.findFirst({
        where: {
          id: data.surveyVersionId,
          surveyId: data.surveyId,
        },
        include: {
          survey: true,
        },
      })

      if (!version) {
        throw new Error('Survey not found')
      }
      // Only published surveys can receive responses.
      if (version.survey.status !== 'published') {
        throw new Error('This survey is not accepting responses')
      }

      // Save response.
      const response = await prisma.response.create({
        data: {
          surveyId: data.surveyId,
          surveyVersionId: data.surveyVersionId,
          answers: data.answers as Prisma.InputJsonObject,
        },
      })
      return {
        success: true,
        message: 'survey submitted successfully',
        data: {
          id: response.id,
          submittedAt: response.submittedAt,
        },
      }
    } catch (error: any) {
      console.error(
        'get survery error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })

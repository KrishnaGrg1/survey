import { createServerFn } from '@tanstack/react-start'
import { ensureSession } from './auth.service'
import { createSurveySchema, getSurveyByIdSchema } from '../schema/survey'
import { prisma } from '#/db'

export const createSurvey = createServerFn({ method: 'POST' })
  .validator((data) => createSurveySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
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
      return {
        success: true,
        message: 'Created survey successfully',
        data: survey,
      }
    } catch (error: any) {
      console.error(
        'create survey error',
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

export const getAllsurveys = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      await ensureSession()
      const surveys = await prisma.survey.findMany({
        include: {
          _count: {
            select: { responses: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      return {
        success: true,
        message: 'Get all surveys successfully',
        data: surveys,
      }
    } catch (error: any) {
      console.error(
        'get surveys error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to get surveys',
      )
    }
  },
)

export const getSurveyById = createServerFn({ method: 'GET' })
  .validator((data) => getSurveyByIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
      const survey = await prisma.survey.findUnique({
        where: { id: data.id },
        include: {
          versions: {
            orderBy: { version: 'asc' },
          },
        },
      })
      return {
        success: true,
        message: 'Get survey successfully',
        data: survey,
      }
    } catch (error: any) {
      console.error(
        'get survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to get survey',
      )
    }
  })

export const updateSurvey = createServerFn({ method: 'POST' })
  .validator((data) => createSurveySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
      const survey = await prisma.survey.findUnique({
        where: { slug: data.slug },
      })
      if (!survey) {
        throw new Error('Survey not found to update')
      }
      const updatedSurvey = await prisma.survey.update({
        where: { slug: data.slug },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          currentVersion: { increment: 1 },
          versions: {
            create: {
              version: survey.currentVersion + 1,
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
      return {
        success: true,
        message: 'updated survey successfully',
        data: updatedSurvey,
      }
    } catch (error: any) {
      console.error(
        'update survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to update survey',
      )
    }
  })
export const deleteSurvey = createServerFn({ method: 'POST' })
  .validator((data) => getSurveyByIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
      const survey = await prisma.survey.findUnique({
        where: { id: data.id },
      })
      if (!survey) {
        throw new Error('Survey not found')
      }
      await prisma.survey.delete({
        where: { id: data.id },
      })
      return {
        success: true,
        message: 'deleted survey successfully',
      }
    } catch (error: any) {
      console.error(
        'delete survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to delete survey',
      )
    }
  })
export const publishSurvey = createServerFn({ method: 'POST' })
  .validator((data) => getSurveyByIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
      const survey = await prisma.survey.findUnique({
        where: { id: data.id },
      })
      if (!survey) {
        throw new Error('Survey not found to publish')
      }
      const updatedSurvey = await prisma.survey.update({
        where: { id: data.id },
        data: {
          status: survey.status === 'published' ? 'draft' : 'published',
        },
      })
      return {
        success: true,
        message:
          survey.status === 'published'
            ? 'survey unpublished successfully'
            : 'published survey successfully',
        data: updatedSurvey,
      }
    } catch (error: any) {
      console.error(
        'publish survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to publish survey',
      )
    }
  })

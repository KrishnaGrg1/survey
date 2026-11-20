import type { Response, Survey } from '#/generated/prisma/client'
import type { CreateSurveyInput } from '#/lib/schema/survey'

export type CreateSurveyResponse = {
  success: boolean
  message: string
  data: {
    id: string
    title: string
    slug: string
    description: string
    status: 'draft' | 'published' | 'closed'
    currentVersion: number
    createdAt: string
    updatedAt: string
    versions: {
      id: string
      surveyId: string
      version: number
      schema: {
        questions: CreateSurveyInput['questions']
      }
    }[]
  }
}

export type CreateSurveyPayload = CreateSurveyInput

export interface GetAllSurveyResponse {
  success: boolean
  message: string
  data: Survey[]
}
export interface DeleteSurveyResponse {
  success: boolean
  message: string
}

export interface PublishSurveyResponse {
  success: boolean
  message: string
  data: Survey
}

export interface ResponseSurveryResponse {
  success: boolean
  message: string
  data: {
    survey: Survey
    response: Response
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export type Analytics = {
  questionId: string
  label: string
  type: string
  totalAnswers: number
  average: number
  distribution: {
    value: number
    count: number
  }[]
}[]

export interface SurveryAnalyticResponse {
  success: boolean
  message: string
  data: {
    survey: {
      id: string
      title: string
      status: string
    }
    totalResponses: number
    questionAnalytics: Analytics
  }
}

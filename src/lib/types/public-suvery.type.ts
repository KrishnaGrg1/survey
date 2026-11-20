import type { Survey, SurveyVersion } from '#/generated/prisma/client'

export interface GetPublicSurveyResponse {
  success: boolean
  message: string
  data: Survey & {
    versions: SurveyVersion[]
  }
}

export type SubmitSurveyPayload = {
  surveyId: string
  surveyVersionId: string
  answers: Record<string, unknown>
}

export type SubmitSurveyResponse = {
  success: boolean
  message: string
  data: {
    id: string
    submittedAt: string
  }
}

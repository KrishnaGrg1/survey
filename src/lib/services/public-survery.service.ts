import { axiosInstance, getApiErrorMessage } from "../axios"
import type { GetPublicSurveyResponse, SubmitSurveyPayload, SubmitSurveyResponse } from "../types/public-suvery.type"

export const getPublicSurveyBySlug = async (
  slug: string,
): Promise<GetPublicSurveyResponse> => {
  try {
    const { data } = await axiosInstance.get<GetPublicSurveyResponse>(
      `/public/surveys/${encodeURIComponent(slug)}`,
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to fetch survey'),
    )
  }
}

export const submitSurvey = async (
  slug: string,
  payload: SubmitSurveyPayload,
): Promise<SubmitSurveyResponse> => {
  try {
    const { data } = await axiosInstance.post<SubmitSurveyResponse>(
      `/public/surveys/${encodeURIComponent(slug)}/response`,
      payload,
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to submit survey'),
    )
  }
}
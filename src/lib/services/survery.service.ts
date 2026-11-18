import { axiosInstance, getApiErrorMessage } from '#/lib/axios'


import type { GetPublicSurveyResponse } from '../types/public-suvery.type'
import type{  GetAllSurveyResponse,   CreateSurveyPayload,   CreateSurveyResponse, PublishSurveyResponse, DeleteSurveyResponse, ResponseSurveryResponse, SurveryAnalyticResponse } from '../types/survery.type'


export async function createSurvey(
  payload: CreateSurveyPayload,
): Promise<CreateSurveyResponse> {
  try {
    const { data } = await axiosInstance.post<CreateSurveyResponse>(
      '/surveys',
      payload,
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to create survey'),
    )
  }
}

export async function getAllsurveys() {
 try {
    const { data } = await axiosInstance.get<GetAllSurveyResponse>(
      '/surveys',
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to create survey'),
    )
  } 
}

export async function getSurveryById(id:string){
  try{
    // const session=await getSession()
    // console.log("session",session)
     const { data } = await axiosInstance.get<GetPublicSurveyResponse>(
      `/surveys/${id}`,
      
    )

    return data 
  }
  catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to create survey'),
    )
  } }


export async function updateSurvey(
  id: string,
  payload: CreateSurveyPayload,
): Promise<CreateSurveyResponse> {
  try {
    const { data } = await axiosInstance.put<CreateSurveyResponse>(
      `/surveys/${id}`,
      payload,
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to update survey'),
    )
  }
}

export async function deleteSurvey(id:string){
  try{
    const res=await axiosInstance.delete<DeleteSurveyResponse>(`/surveys/${id}`)
    return res

  }
catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to create survey'),
    )
  }
}


export async function publishSurvey(id:string){
  try{
    const res=await axiosInstance.post<PublishSurveyResponse>(`/surveys/${id}/publish`)
    return res

  }
catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to create survey'),
    )
  }
}


export async function getSurveyAnalytic(id: string) {
  try {
    const { data } = await axiosInstance.get<SurveryAnalyticResponse>(
      `/surveys/${id}/analytics`,
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to fetch survey analytics'),
    )
  }
}


export async function getSurveyResponses(id: string) {
  try {
    const { data } = await axiosInstance.get<ResponseSurveryResponse>(
      `/surveys/${id}/responses`,
    )

    return data
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Failed to fetch survey responses'),
    )
  }
}
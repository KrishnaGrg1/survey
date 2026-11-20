import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createSurvey,
  getAllsurveys,
  getSurveryById,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  getSurveyAnalytic,
  getSurveyResponses,
} from '#/lib/services/survery.service'

import type { CreateSurveyPayload } from '#/lib/types/survery.type'
import { toast } from 'sonner'

// Query keys
export const surveyKeys = {
  all: ['admin', 'surveys'] as const,
  detail: (id: string) => ['admin', 'survey', id] as const,
  analytics: (id: string) => ['admin', 'survey', id, 'analytics'] as const,
  responses: (id: string) => ['admin', 'survey', id, 'responses'] as const,
}

// GET ALL SURVEYS
export function useGetAllSurveys() {
  return useQuery({
    queryKey: surveyKeys.all,
    queryFn: getAllsurveys,
  })
}

// GET SURVEY BY ID
export function useGetSurveyById(id: string) {
  return useQuery({
    queryKey: surveyKeys.detail(id),
    queryFn: () => getSurveryById(id),
    enabled: !!id,
  })
}

// GET SURVEY ANALYTICS
export function useGetSurveyAnalytics(id: string) {
  return useQuery({
    queryKey: surveyKeys.analytics(id),
    queryFn: () => getSurveyAnalytic(id),
    enabled: !!id,
  })
}

// GET SURVEY RESPONSES
export function useGetSurveyResponses(id: string) {
  return useQuery({
    queryKey: surveyKeys.responses(id),
    queryFn: () => getSurveyResponses(id),
    enabled: !!id,
  })
}

// CREATE SURVEY
export function useCreateSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSurvey,

    onSuccess: (result) => {
      toast.success(result.message || 'Survey created successfully')
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create survey')
    },
  })
}

// UPDATE SURVEY
export function useUpdateSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: CreateSurveyPayload
    }) => updateSurvey(id, payload),

    onSuccess: (result, variables) => {
      toast.success(result.message || 'Survey updated successfully')

      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
      queryClient.invalidateQueries({
        queryKey: surveyKeys.detail(variables.id),
      })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update survey')
    },
  })
}

// PUBLISH / UNPUBLISH SURVEY
export function usePublishSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => publishSurvey(id),

    onSuccess: (_result, id) => {
      toast.success('Survey status updated successfully')

      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to publish survey')
    },
  })
}

// DELETE SURVEY
export function useDeleteSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSurvey(id),

    onSuccess: (_result, id) => {
      toast.success('Survey deleted successfully')

      queryClient.removeQueries({
        queryKey: surveyKeys.detail(id),
      })

      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete survey')
    },
  })
}

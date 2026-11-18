import { z } from 'zod'
import { questionSchema } from './survey'

export const surveyIdSchema = z.object({
  id: z.string().min(1),
})

export const responseQuerySchema = z.object({
  id: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  versionId: z.string().optional(),
})

export const storedSurveySchema = z.object({
  questions: z.array(questionSchema),
})

export type ResponseQuery = z.infer<typeof responseQuerySchema>

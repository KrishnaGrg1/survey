import z from 'zod'

export const conditionSchema = z.object({
  questionId: z.string(),
  operator: z.enum(['equals', 'not_equals', 'includes', 'gte', 'lte']),
  value: z.union([z.string(), z.number()]),
})

const base = {
  id: z.string().min(1).max(40), // stable, generated once (nanoid)
  label: z.string().trim().min(1).max(300),
  required: z.boolean().default(false),
  showIf: conditionSchema.optional(),
}
const optionSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1).max(200),
})

export const questionSchema = z.discriminatedUnion('type', [
  z.object({ ...base, type: z.literal('text') }),
  z.object({
    ...base,
    type: z.literal('single_choice'),
    options: z.array(optionSchema).min(2).max(20),
  }),
  z.object({
    ...base,
    type: z.literal('multi_choice'),
    options: z.array(optionSchema).min(2).max(20),
  }),
  z.object({ ...base, type: z.literal('rating') }), // fixed 1-5
])

export const createSurveySchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain lowercase letters, numbers, and hyphens',
    ),
  description: z.string().max(2000).default(''),
  questions: z.array(questionSchema).min(1).max(100),
})

export const getSurveyByIdSchema = z.object({
  id: z.string().min(1),
})

export type CreateSurveyInput = z.infer<typeof createSurveySchema>
export type Question = z.infer<typeof questionSchema>
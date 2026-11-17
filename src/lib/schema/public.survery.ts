import z from "zod";

export const getSurveyBySlugSchema=z.object({
      slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain lowercase letters, numbers, and hyphens',
    ),
})


export const submitSurveySchema = z.object({
  surveyId: z.string().min(1),
  surveyVersionId: z.string().min(1),
  answers: z.record(z.string(), z.unknown()),
});
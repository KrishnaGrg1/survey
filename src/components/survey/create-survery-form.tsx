import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { z } from 'zod'

import { createSurveySchema } from '#/lib/schema/survey'

import { Alert, AlertDescription } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { useCreateSurvey } from '#/hooks/use-survery'
import { FieldInfo } from '#/components/ui/fieldInfo'
import { Typography } from '../ui/typography'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
// z.input (not z.infer): `description` has a default, so on the way IN it is optional.
// The form AND the validator must use this same type or TypeScript rejects the schema.
type FormValues = z.input<typeof createSurveySchema>
type Question = FormValues['questions'][number]
type QuestionType = Question['type']

const MIN_OPTIONS = 2
const MAX_OPTIONS = 20

const QUESTION_TYPES: { type: QuestionType; label: string }[] = [
  { type: 'text', label: 'Text' },
  { type: 'single_choice', label: 'Single choice' },
  { type: 'multi_choice', label: 'Multiple choice' },
  { type: 'rating', label: 'Rating' },
]

// Typed explicitly so `questions` is Question[] and not `never[]`
// (an inferred `[]` is what made "questions" an unknown field name).
const defaultValues: FormValues = {
  title: '',
  slug: '',
  description: '',
  questions: [],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const newId = () => crypto.randomUUID()

function createQuestion(type: QuestionType): Question {
  const base = { id: newId(), label: '', required: false }

  if (type === 'single_choice' || type === 'multi_choice') {
    return {
      ...base,
      type,
      options: [
        { id: newId(), label: '' },
        { id: newId(), label: '' },
      ],
    }
  }

  return { ...base, type }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CreateSurveyForm() {
  const { mutateAsync, isPending, error: createError } = useCreateSurvey()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues,

    // Validates the whole form against your Zod schema while typing and on submit.
    validators: {
      onChange: createSurveySchema,
    },

    onSubmitInvalid: () => {
      toast.error('Please check your form fields')
    },

    onSubmit: async ({ value }) => {
      // `parse` applies the schema defaults (e.g. description: '') to give the API type
      const payload = createSurveySchema.parse(value)

      try {
        const res = await mutateAsync(payload)
        navigate({ to: `/admin/surveys/${res.data.id}` })
      } catch {
        // shown in the Alert above the button (and by the hook's toast)
      }
    },
  })

  return (
    <form
      aria-label="Create survey"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="mx-auto w-full max-w-3xl space-y-4"
    >
      {/* SERVER ERROR */}
      {createError && (
        <Alert className="rounded-lg border-[#E05555]/25 bg-[#E05555]/[0.06] px-3 py-2.5">
          <AlertDescription className="text-xs text-[#E05555]">
            {createError.message || 'Could not create the survey'}
          </AlertDescription>
        </Alert>
      )}

      {/* SURVEY DETAILS */}
      <div className="island-shell space-y-3 rounded-xl p-5">
        {/* <h2 className="text-sm font-semibold text-[#F5F0E8]"> */}
        <Typography variant="h3">Survey details</Typography>
        {/* </h2> */}

        {/* TITLE */}
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Title is required'
                : value.length < 2
                  ? 'Title must be at least 2 characters'
                  : undefined,
          }}
        >
          {(field) => {
            return (
              <div className="space-y-1">
                <Label htmlFor={field.name}>Title</Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="Customer feedback survey"
                    // aria-invalid={!!error}
                    // aria-describedby={error ? `error-${field.name}` : undefined}

                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
                <FieldInfo field={field} />
              </div>
            )
          }}
        </form.Field>

        {/* SLUG */}
        <form.Field
          name="slug"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Slug is required'
                : value.length < 2
                  ? 'Slug must be at least 2 characters'
                  : undefined,
          }}
        >
          {(field) => {
            return (
              <div className="space-y-1">
                <Label htmlFor={field.name}>Slug</Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="customer-feedback"
                    autoComplete="off"

                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
                <FieldInfo field={field} />
              </div>
            )
          }}
        </form.Field>

        {/* DESCRIPTION */}
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Description is required'
                : value.length < 2
                  ? 'Description must be at least 2 characters'
                  : undefined,
          }}
        >
          {(field) => {
            return (
              <div className="space-y-1">
                <Label htmlFor={field.name}>Description</Label>
                <div className="relative">
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    placeholder="Tell respondents what this survey is about..."

                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
                <FieldInfo field={field} />
              </div>
            )
          }}
        </form.Field>
      </div>

      {/* QUESTIONS */}
      <div className="island-shell space-y-3 rounded-xl p-5">
        <form.Field
          name="questions"
          mode="array"
          validators={{
            onChange: ({ value }) => {
              if (value.length < 1) {
                return 'Please add at least one question'
              }

              if (value.length > 50) {
                return `You can add a maximum of 50 questions`
              }

              return undefined
            },
          }}
        >
          {(questionsField) => {
            const questions = questionsField.state.value

            return (
              <>
                <div className="flex items-center justify-between">
                  <Typography variant="h3">Questions</Typography>
                  <span className="text-[10px] text-[#4A4860]">
                    {questions.length}{' '}
                    {questions.length === 1 ? 'question' : 'questions'}
                  </span>
                </div>

                {/* <ErrorText id="error-questions" message={listError} /> */}
                <FieldInfo field={questionsField} />

                {questions.map((question, qi) => (
                  <div
                    key={question.id}
                    className="space-y-3 rounded-lg border border-[#2A2A3A] p-4"
                  >
                    {/* QUESTION HEADER */}
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Question {qi + 1}
                        <span className="ml-2 text-[10px] font-normal text-[#4A4860]">
                          {
                            QUESTION_TYPES.find((t) => t.type === question.type)
                              ?.label
                          }
                        </span>
                      </span>

                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={qi === 0}
                          aria-label={`Move question ${qi + 1} up`}
                          onClick={() => questionsField.moveValue(qi, qi - 1)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={qi === questions.length - 1}
                          aria-label={`Move question ${qi + 1} down`}
                          onClick={() => questionsField.moveValue(qi, qi + 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"

                          aria-label={`Delete question ${qi + 1}`}
                          onClick={() => questionsField.removeValue(qi)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* QUESTION TEXT */}
                    <form.Field
                      name={`questions[${qi}].label`}
                      validators={{
                        onChange: ({ value }) =>
                          !value.trim()
                            ? 'Question is required'
                            : value.trim().length < 3
                              ? 'Question must be at least 3 characters'
                              : value.length > 500
                                ? 'Question cannot exceed 500 characters'
                                : undefined,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-1">
                          <Input
                            name={field.name}
                            placeholder="Enter your question..."
                            aria-label={`Question ${qi + 1} text`}
                            aria-invalid={
                              field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0
                            }
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />

                          <FieldInfo field={field} />
                        </div>
                      )}
                    </form.Field>

                    {/* OPTIONS (single / multiple choice only) */}
                    {'options' in question && (
                      <form.Field
                        name={`questions[${qi}].options`}
                        mode="array"
                        validators={{
                          onChange: ({ value }) => {
                            if (value.length < MIN_OPTIONS) {
                              return 'At least 2 options are required'
                            }

                            if (value.length > MAX_OPTIONS) {
                              return 'Maximum 20 options are allowed'
                            }

                            const labels = value
                              .map((option) =>
                                option.label.trim().toLowerCase(),
                              )
                              .filter(Boolean)

                            if (new Set(labels).size !== labels.length) {
                              return 'Duplicate options are not allowed'
                            }

                            return undefined
                          },
                        }}
                      >
                        {(optionsField) => {
                          const options = optionsField.state.value ?? []

                          return (
                            <div className="space-y-2">
                              <span>Options</span>

                              {options.map((option, oi) => (
                                <form.Field
                                  key={option.id}
                                  name={`questions[${qi}].options[${oi}].label`}
                                  validators={{
                                    onChange: ({ value }) =>
                                      !value.trim()
                                        ? 'Option label is required'
                                        : value.trim().length < 1
                                          ? 'Option label cannot be empty'
                                          : value.length > 200
                                            ? 'Option cannot exceed 200 characters'
                                            : undefined,
                                  }}
                                >
                                  {(field) => (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Input
                                          name={field.name}
                                          value={field.state.value}
                                          placeholder={`Option ${oi + 1}`}
                                          aria-label={`Question ${qi + 1} option ${oi + 1}`}
                                          aria-invalid={
                                            field.state.meta.isTouched &&
                                            field.state.meta.errors.length > 0
                                          }
                                          onChange={(e) =>
                                            field.handleChange(e.target.value)
                                          }
                                          onBlur={field.handleBlur}
                                        />

                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          disabled={
                                            options.length <= MIN_OPTIONS
                                          }
                                          aria-label={`Remove question ${qi + 1} option ${oi + 1}`}
                                          onClick={() =>
                                            optionsField.removeValue(oi)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <FieldInfo field={field} />
                                    </div>
                                  )}
                                </form.Field>
                              ))}

                              <FieldInfo field={optionsField} />

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={options.length >= MAX_OPTIONS}
                                aria-label={`Add option to question ${qi + 1}`}
                                onClick={() =>
                                  optionsField.pushValue({
                                    id: newId(),
                                    label: `Option ${options.length + 1}`,
                                  })
                                }
                              >
                                <Plus className="size-3.5" />
                                Add option
                              </Button>
                            </div>
                          )
                        }}
                      </form.Field>
                    )}

                    {/* REQUIRED */}
                    <form.Field name={`questions[${qi}].required`}>
                      {(field) => (
                        <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-[#B8B5C5]">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-[#E8A838]"
                            checked={field.state.value ?? false}
                            onChange={(e) =>
                              field.handleChange(e.target.checked)
                            }
                          />
                          Required question
                        </label>
                      )}
                    </form.Field>
                  </div>
                ))}

                {/* ADD QUESTION */}
                <div className="flex flex-wrap gap-2">
                  {QUESTION_TYPES.map(({ type, label }) => (
                    <Button
                      key={type}
                      type="button"
                      variant="outline"
                      onClick={() =>
                        questionsField.pushValue(createQuestion(type))
                      }
                    >
                      <Plus className="size-3.5" />
                      {label}
                    </Button>
                  ))}
                </div>
              </>
            )
          }}
        </form.Field>
      </div>

      {/* BUTTON */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => {
          const busy = isPending || isSubmitting

          return (
            <div className="mt-2">
              <Button
                type="submit"
                disabled={!canSubmit || busy}
                className="w-full"
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F]" />
                    Creating survey...
                  </span>
                ) : (
                  'Create survey'
                )}
              </Button>
            </div>
          )
        }}
      </form.Subscribe>
    </form>
  )
}

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { createSurveySchema } from '#/lib/schema/survey'

import { cn } from '#/lib/utils'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { useCreateSurvey } from '#/hooks/use-survery'
import { useNavigate } from '@tanstack/react-router'

const inputClass = (hasError: boolean) =>
  cn(
    'h-11 w-full rounded-lg border bg-[#111118] px-3',
    'text-sm text-[#F5F0E8] placeholder:text-[#4A4860]',
    'outline-none transition-all',
    hasError
      ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20'
      : 'border-[#2A2A3A] focus-visible:border-[#E8A838] focus-visible:ring-2 focus-visible:ring-[#E8A838]/20',
  )

type FormValues = z.input<typeof createSurveySchema>

export default function CreateSurveyForm() {
  const { mutateAsync, isPending } = useCreateSurvey()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<FormValues['questions']>([])

  const form = useForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      questions: [],
    } as FormValues,

    validators: {
      onSubmit: createSurveySchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const result = createSurveySchema.parse(value)

        const res = await mutateAsync(result)
        navigate({ to: `/admin/surveys/${res.data.id}` })
        toast.success('Survey created successfully')
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error('Please check your form fields')
          return
        }

        // Mutation hook handles API errors.
      }
    },
  })

  const addQuestion = (
    type: 'text' | 'single_choice' | 'multi_choice' | 'rating',
  ) => {
    const question = {
      id: crypto.randomUUID(),
      label: '',
      required: false,
      type,
      ...(type === 'single_choice' || type === 'multi_choice'
        ? {
            options: [
              { id: crypto.randomUUID(), label: 'Option 1' },
              { id: crypto.randomUUID(), label: 'Option 2' },
            ],
          }
        : {}),
    } as FormValues['questions'][number]

    const next = [...questions, question]

    setQuestions(next)
    form.setFieldValue('questions', next)
  }

  const removeQuestion = (id: string) => {
    const next = questions.filter((q) => q.id !== id)

    setQuestions(next)
    form.setFieldValue('questions', next)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      noValidate
      className="mx-auto w-full max-w-3xl space-y-6"
    >
      {/* SURVEY DETAILS */}
      <div className="island-shell space-y-4 rounded-xl p-5">
        <h2 className="text-lg font-semibold">Survey details</h2>

        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? 'Survey title is required' : undefined,
          }}
        >
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0

            return (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  placeholder="Customer feedback survey"
                  className={inputClass(hasError)}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {hasError && (
                  <p className="text-xs text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="slug">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0

            return (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Slug</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  placeholder="customer-feedback"
                  className={inputClass(hasError)}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {hasError && (
                  <p className="text-xs text-red-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                value={field.state.value}
                placeholder="Tell respondents what this survey is about..."
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* QUESTIONS */}
      <div className="island-shell space-y-4 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>
          <span className="text-xs text-muted-foreground">
            {questions.length} questions
          </span>
        </div>

        {questions.map((question, index) => (
          <div
            key={question.id}
            className="space-y-3 rounded-lg border border-[#2A2A3A] p-4"
          >
            <div className="flex items-center justify-between">
              <Label>Question {index + 1}</Label>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(question.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <Input
              placeholder="Enter your question..."
              value={question.label}
              onChange={(e) => {
                const next = questions.map((q) =>
                  q.id === question.id ? { ...q, label: e.target.value } : q,
                )

                setQuestions(next)
                form.setFieldValue('questions', next)
              }}
            />

            <div className="text-xs text-muted-foreground">
              Question type: {question.type}
            </div>

            {'options' in question && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <Input
                    key={option.id}
                    value={option.label}
                    onChange={(e) => {
                      const next = questions.map((q) => {
                        if (q.id !== question.id || !('options' in q)) {
                          return q
                        }

                        return {
                          ...q,
                          options: q.options.map((o) =>
                            o.id === option.id
                              ? { ...o, label: e.target.value }
                              : o,
                          ),
                        }
                      })

                      setQuestions(next)
                      form.setFieldValue('questions', next)
                    }}
                  />
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => {
                  const next = questions.map((q) =>
                    q.id === question.id
                      ? { ...q, required: e.target.checked }
                      : q,
                  )

                  setQuestions(next)
                  form.setFieldValue('questions', next)
                }}
              />
              Required question
            </label>
          </div>
        ))}

        {/* ADD QUESTION */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestion('text')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Text
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestion('single_choice')}
          >
            Single choice
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestion('multi_choice')}
          >
            Multiple choice
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestion('rating')}
          >
            Rating
          </Button>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              disabled={isPending || isSubmitting}
              className="w-full bg-[#E8A838] text-[#0A0A0F] hover:bg-[#F0B848]"
            >
              {isPending || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating survey...
                </>
              ) : (
                'Create survey'
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}

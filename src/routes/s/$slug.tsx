import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type React from 'react'

import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Checkbox } from '#/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import { toast } from 'sonner'

import {
  useGetPublicSurveyBySlug,
  useSubmitSurvey,
} from '#/hooks/use-public-survey'

export const Route = createFileRoute('/s/$slug')({
  component: RouteComponent,
})

type Condition = {
  questionId: string
  operator: 'equals' | 'not_equals' | 'includes' | 'gte' | 'lte'
  value: string | number
}

type Question = {
  id: string
  type: 'text' | 'single_choice' | 'multi_choice' | 'rating'
  label: string
  required: boolean
  options?: {
    id: string
    label: string
  }[]
  showIf?: Condition
}

type Answers = Record<string, unknown>

// Evaluate conditional visibility

function isVisible(
  q: Question,
  answers: Answers,
  questions: Question[],
): boolean {
  if (!q.showIf) return true

  const { questionId, operator, value } = q.showIf

  const parentQuestion = questions.find(
    (question) => question.id === questionId,
  )

  if (!parentQuestion) return false

  // Nested conditional question support
  if (!isVisible(parentQuestion, answers, questions)) {
    return false
  }

  const answer = answers[questionId]

  if (answer === undefined || answer === '') {
    return false
  }

  // Convert selected option IDs into their labels
  const getAnswerLabel = (selected: unknown) => {
    const option = parentQuestion.options?.find((opt) => opt.id === selected)

    return option ? option.label : selected
  }

  const actualValue = Array.isArray(answer)
    ? answer.map(getAnswerLabel)
    : getAnswerLabel(answer)

  switch (operator) {
    case 'equals':
      return actualValue === value

    case 'not_equals':
      return actualValue !== value

    case 'includes':
      return Array.isArray(actualValue)
        ? actualValue.includes(value)
        : String(actualValue).includes(String(value))

    case 'gte':
      return Number(actualValue) >= Number(value)

    case 'lte':
      return Number(actualValue) <= Number(value)

    default:
      return false
  }
}

function RouteComponent() {
  const { slug } = Route.useParams()

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetPublicSurveyBySlug(slug)

  const survey = response?.data
  const version = survey?.versions?.at(0) as
    { id: string; schema?: { questions?: Question[] } } | undefined

  const questions: Question[] = version?.schema?.questions ?? []

  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  const { mutateAsync, isPending } = useSubmitSurvey(slug)

  // Get only currently visible questions
  const visible = questions.filter((q) => isVisible(q, answers, questions))

  // Update answers and clear hidden question answers
  const updateAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => {
      const next: Answers = {
        ...prev,
        [questionId]: value,
      }

      // Repeatedly remove answers for hidden questions.
      // This also handles nested conditions.
      let changed = true

      while (changed) {
        changed = false

        for (const question of questions) {
          if (
            next[question.id] !== undefined &&
            !isVisible(question, next, questions)
          ) {
            delete next[question.id]
            changed = true
          }
        }
      }

      return next
    })
  }

  if (isLoading) {
    return (
      <div className="page-wrap py-10">
        <p className="text-muted-foreground">Loading survey...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-wrap py-10">
        <p className="text-destructive">
          {error instanceof Error ? error.message : 'Failed to load survey'}
        </p>
      </div>
    )
  }

  if (!survey) {
    return <div className="page-wrap py-10">Survey not found</div>
  }

  if (survey.status !== 'published') {
    return (
      <div className="page-wrap py-10">
        This survey is not accepting responses
      </div>
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate visible required questions only
    for (const q of visible) {
      const answer = answers[q.id]

      if (
        q.required &&
        (answer === undefined ||
          answer === '' ||
          (Array.isArray(answer) && answer.length === 0))
      ) {
        toast.error(`Required: ${q.label}`)
        return
      }
    }

    // Submit visible answers only
    const visibleAnswers = Object.fromEntries(
      visible
        .filter((q) => answers[q.id] !== undefined)
        .map((q) => [q.id, answers[q.id]]),
    )

    try {
      await mutateAsync({
        surveyId: survey.id,
        surveyVersionId: version!.id,
        answers: visibleAnswers,
      })

      setSubmitted(true)
    } catch {
      // Error toast handled by mutation hook
    }
  }

  if (submitted) {
    return (
      <div className="page-wrap py-10 text-center">
        <h1 className="text-2xl font-semibold">Thank you!</h1>

        <p className="text-muted-foreground mt-2">
          Your response has been recorded.
        </p>
      </div>
    )
  }

  return (
    <div className="page-wrap py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Survey Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {survey.title}
          </h1>

          {survey.description && (
            <p className="text-muted-foreground mt-1">{survey.description}</p>
          )}
        </div>

        {/* Survey Questions */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {visible.map((q) => (
            <div key={q.id} className="island-shell rounded-xl p-5 space-y-3">
              <Label>
                {q.label}
                {q.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {/* TEXT */}
              {q.type === 'text' && (
                <Textarea
                  value={(answers[q.id] as string) ?? ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder="Enter your answer..."
                />
              )}

              {/* SINGLE CHOICE */}
              {q.type === 'single_choice' && (
                <RadioGroup
                  value={(answers[q.id] as string) ?? ''}
                  onValueChange={(value) => updateAnswer(q.id, value)}
                >
                  {q.options?.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={option.id}
                        id={`${q.id}-${option.id}`}
                      />

                      <Label htmlFor={`${q.id}-${option.id}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* MULTIPLE CHOICE */}
              {q.type === 'multi_choice' && (
                <div className="space-y-2">
                  {q.options?.map((option) => {
                    const selected = (answers[q.id] as string[]) ?? []

                    return (
                      <div key={option.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`${q.id}-${option.id}`}
                          checked={selected.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...selected, option.id]
                              : selected.filter((id) => id !== option.id)

                            updateAnswer(q.id, next)
                          }}
                        />

                        <Label htmlFor={`${q.id}-${option.id}`}>
                          {option.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* RATING */}
              {q.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={answers[q.id] === n ? 'default' : 'outline'}
                      onClick={() => updateAnswer(q.id, n)}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Submit */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </form>
      </div>
    </div>
  )
}

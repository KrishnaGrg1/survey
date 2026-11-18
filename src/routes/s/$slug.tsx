import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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

function isVisible(q: any, answers: Record<string, unknown>) {
  if (!q.showIf) return true
  const c: any = q.showIf
  const val = answers[c.questionId]
  switch (c.operator) {
    case 'equals':
      return val === c.value
    case 'not_equals':
      return val !== c.value
    case 'includes':
      return Array.isArray(val)
        ? val.includes(c.value)
        : String(val).includes(String(c.value))
    case 'gte':
      return Number(val) >= Number(c.value)
    case 'lte':
      return Number(val) <= Number(c.value)
    default:
      return true
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
  const version = survey?.versions?.at(0) as any
  const questions: any[] = version?.schema?.questions ?? []

  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)

  const { mutateAsync, isPending } = useSubmitSurvey(slug)

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
  if (survey?.status !== 'published')
    return (
      <div className="page-wrap py-10">
        This survey is not accepting responses
      </div>
    )

  const visible = questions.filter((q) => isVisible(q, answers))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

    const visibleAnswers = Object.fromEntries(
      visible
        .filter((q) => answers[q.id] !== undefined)
        .map((q) => [q.id, answers[q.id]]),
    )

    try {
      await mutateAsync({
        surveyId: survey.id,
        surveyVersionId: version.id,
        answers: visibleAnswers,
      })

      setSubmitted(true)
    } catch {
      // Error toast is handled by the mutation hook
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
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="text-muted-foreground mt-1">{survey.description}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {visible.map((q) => (
            <div key={q.id} className="island-shell rounded-xl p-5 space-y-2">
              <Label>
                {q.label}
                {q.required && ' *'}
              </Label>
              {q.type === 'text' && (
                <Textarea
                  value={(answers[q.id] as string) ?? ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
              )}
              {q.type === 'single_choice' && (
                <RadioGroup
                  value={(answers[q.id] as string) ?? ''}
                  onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}
                >
                  {q.options?.map((o: any) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <RadioGroupItem value={o.id} id={`${q.id}-${o.id}`} />
                      <Label htmlFor={`${q.id}-${o.id}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {q.type === 'multi_choice' && (
                <div className="space-y-2">
                  {q.options?.map((o: any) => {
                    const selected = (answers[q.id] as string[]) ?? []
                    return (
                      <div key={o.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selected.includes(o.id)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...selected, o.id]
                              : selected.filter((x) => x !== o.id)
                            setAnswers({ ...answers, [q.id]: next })
                          }}
                        />
                        <Label>{o.label}</Label>
                      </div>
                    )
                  })}
                </div>
              )}
              {q.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={answers[q.id] === n ? 'default' : 'outline'}
                      onClick={() => setAnswers({ ...answers, [q.id]: n })}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  )
}

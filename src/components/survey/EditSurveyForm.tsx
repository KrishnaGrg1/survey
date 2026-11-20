import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { nanoid } from 'nanoid'
import { ArrowLeftIcon, SendIcon, TrashIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { QuestionEditor } from '#/components/survey/QuestionEditor'

import {
  useUpdateSurvey,
  usePublishSurvey,
  useDeleteSurvey,
} from '#/hooks/use-survery'

import type { CreateSurveyPayload } from '#/lib/types/survery.type'

type Props = {
  survey: any
}

export default function EditSurveyForm({ survey }: Props) {
  const navigate = useNavigate()

  const { mutateAsync: update, isPending: updatePending } = useUpdateSurvey()

  const { mutateAsync: publish, isPending: publishPending } = usePublishSurvey()

  const { mutateAsync: deleteSurvey, isPending: deletePending } =
    useDeleteSurvey()

  const schema = survey.versions?.at(-1)?.schema as
    { questions?: CreateSurveyPayload['questions'] } | undefined

  const form = useForm({
    defaultValues: {
      title: survey.title ?? '',
      slug: survey.slug ?? '',
      description: survey.description ?? '',
      questions: schema?.questions ?? [],
    },

    onSubmit: async ({ value }) => {
      await update({
        id: survey.id,
        payload: value,
      })
    },
  })

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this survey?')) return

    await deleteSurvey(survey.id)
    navigate({ to: '/admin/surveys' })
  }

  const handlePublish = async () => {
    await publish(survey.id)
  }

  return (
    <div className="page-wrap py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/admin/surveys' })}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>

        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">Edit Survey</h1>
          <p className="text-muted-foreground mt-1">
            Update questions, metadata, or publish status.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        <div className="island-shell rounded-xl p-5 space-y-4">
          <form.Field name="title">
            {(field) => (
              <div>
                <Label>Title</Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Customer feedback"
                />
                {field.state.meta.errors.map((error) => (
                  <p
                    key={String(error)}
                    className="text-sm text-destructive mt-1"
                  >
                    {String(error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="slug">
            {(field) => (
              <div>
                <Label>Slug</Label>
                <Input
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    )
                  }
                  onBlur={field.handleBlur}
                  placeholder="customer-feedback"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div>
                <Label>Description</Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Short description"
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="questions" mode="array">
          {(field) => (
            <div className="space-y-4">
              {field.state.value.map((question, index) => (
                <div key={question.id}>
                  <QuestionEditor
                    question={question as any}
                    index={index}
                    allQuestions={field.state.value as any}
                    onChange={(updated) => {
                      field.setValue(
                        field.state.value.map((q, i) =>
                          i === index ? updated : q,
                        ) as CreateSurveyPayload['questions'],
                      )
                    }}
                    onRemove={() => {
                      field.removeValue(index)
                    }}
                    onMoveUp={() => {
                      if (index === 0) return

                      const questions = [...field.state.value]
                      ;[questions[index - 1], questions[index]] = [
                        questions[index],
                        questions[index - 1],
                      ]

                      field.setValue(questions)
                    }}
                    onMoveDown={() => {
                      if (index === field.state.value.length - 1) return

                      const questions = [...field.state.value]
                      ;[questions[index], questions[index + 1]] = [
                        questions[index + 1],
                        questions[index],
                      ]

                      field.setValue(questions)
                    }}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  field.pushValue({
                    id: nanoid(),
                    type: 'text',
                    label: '',
                    required: false,
                  })
                }
              >
                Add Question
              </Button>
            </div>
          )}
        </form.Field>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={updatePending}>
            {updatePending ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handlePublish}
            disabled={publishPending}
          >
            <SendIcon className="size-4 mr-2" />
            {survey.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePending}
          >
            <TrashIcon className="size-4 mr-2" />
            {deletePending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </form>
    </div>
  )
}

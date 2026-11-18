import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useGetSurveyAnalytics } from '#/hooks/use-survery'

export const Route = createFileRoute('/admin/surveys/$id/result')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetSurveyAnalytics(id)

  const analytics = response?.data

  if (isLoading) {
    return (
      <div className="page-wrap py-10">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-wrap py-10">
        <p className="text-destructive">
          {error?.message || 'Failed to load survey analytics'}
        </p>
      </div>
    )
  }

  if (!analytics) {
    return <div className="page-wrap py-10">Survey not found</div>
  }

  return (
    <div className="page-wrap py-10">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <a href="/admin/surveys">
            <ArrowLeftIcon className="size-4" />
          </a>
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {analytics.survey.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {analytics.totalResponses} responses
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {analytics.questionAnalytics.map((qa: any) => (
          <div key={qa.questionId} className="island-shell rounded-xl p-5">
            <h3 className="font-medium mb-2">{qa.label}</h3>

            <p className="text-xs text-muted-foreground mb-4">
              {qa.totalAnswers} answers
            </p>

            {(qa.type === 'single_choice' || qa.type === 'multi_choice') && (
              <div className="space-y-2">
                {qa.distribution.map((item: any) => (
                  <div key={item.value} className="flex items-center gap-3">
                    <div className="w-40 text-sm">{item.label}</div>

                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <div className="w-16 text-right text-sm">
                      {item.count} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            )}

            {qa.type === 'rating' && (
              <div className="space-y-2">
                {qa.distribution.map((item: any) => (
                  <div key={item.value} className="flex items-center gap-3">
                    <div className="w-16 text-sm">{item.value}</div>

                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            qa.totalAnswers
                              ? (item.count / qa.totalAnswers) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="w-16 text-right text-sm">{item.count}</div>
                  </div>
                ))}

                <p className="text-sm mt-2">Average: {qa.average}</p>
              </div>
            )}

            {qa.type === 'text' && (
              <ul className="list-disc pl-5 space-y-1">
                {qa.answers?.map((answer: string, idx: number) => (
                  <li key={idx} className="text-sm">
                    {answer}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

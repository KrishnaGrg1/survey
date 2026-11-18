import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getAllsurveys } from '#/lib/server-fn-services/survery.service'
import { PlusIcon, BarChart3Icon, FileTextIcon } from 'lucide-react'
import { getSession } from '#/lib/server-fn-services/auth.service'

export const Route = createFileRoute('/admin/surveys/')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { user: session.user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ['admin', 'surveys'],
    queryFn: () => getAllsurveys(),
  })

  const surveys = data?.data ?? []

  return (
    <div className="page-wrap py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Surveys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your surveys, view results, and publish forms.
          </p>
        </div>
        <Link
          to="/admin/surveys/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="size-4" />
          New Survey
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="island-shell rounded-xl p-10 text-center">
          <FileTextIcon className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-medium">No surveys yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first survey to start collecting responses.
          </p>
          <Link
            to="/admin/surveys/new"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <PlusIcon className="size-4" />
            Create Survey
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {surveys.map((survey: any) => (
            <div
              key={survey.id}
              className="island-shell rounded-xl p-5 transition-colors hover:border-lagoon-deep/40"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-lg font-medium">
                      {survey.title}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        survey.status === 'published'
                          ? 'bg-palm/10 text-palm'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {survey.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {survey.description || 'No description'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    /{survey.slug} · {survey._count?.responses ?? 0} responses
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    // to={`/admin/surveys/${survey.id}/result`}
                    to="/admin/surveys/$id/result"
                    params={{ id: survey.id }}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                  >
                    <BarChart3Icon className="size-4" />
                    Analytics
                  </Link>
                  <Link
                    to="/admin/surveys/$id"
                    params={{ id: survey.id }}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

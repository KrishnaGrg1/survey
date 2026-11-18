import { createFileRoute } from '@tanstack/react-router'
import { useGetSurveyById } from '#/hooks/use-survery'
import EditSurveyForm from '#/components/survey/EditSurveyForm'

export const Route = createFileRoute('/admin/surveys/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data, isLoading, isError, error } = useGetSurveyById(id)

  if (isLoading) {
    return <div className="page-wrap py-10">Loading survey...</div>
  }

  if (isError) {
    return (
      <div className="page-wrap py-10 text-destructive">
        {error.message || 'Failed to load survey'}
      </div>
    )
  }

  if (!data?.data) {
    return <div className="page-wrap py-10">Survey not found</div>
  }

  return <EditSurveyForm survey={data.data} />
}

import CreateSurveyForm from '#/components/survey/create-survery-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/surveys/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="page-wrap py-10">
      <CreateSurveyForm />
    </div>
  )
}

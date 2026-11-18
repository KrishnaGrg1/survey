import CreateSurveyForm from '#/components/survey/create-survery-form'
import { Button } from '#/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/admin/surveys/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="page-wrap py-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/admin/surveys' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Survey
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new survey and add your questions.
          </p>
        </div>
      </div>

      <CreateSurveyForm />
    </div>
  )
}

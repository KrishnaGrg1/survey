import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/surveys/$id/result')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/surveys/$id/result"!</div>
}

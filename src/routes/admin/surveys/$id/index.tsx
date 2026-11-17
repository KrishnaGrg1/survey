import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/surveys/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/surveys/$id/"!</div>
}

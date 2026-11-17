import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/s/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/s/$slug"!</div>
}

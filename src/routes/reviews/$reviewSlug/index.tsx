import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reviews/$reviewSlug/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/reviews/$reviewSlug/"!</div>
}

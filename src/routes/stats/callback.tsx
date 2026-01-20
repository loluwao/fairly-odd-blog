import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/stats/callback')({
  component: CallbackPage,
})

function CallbackPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()

  useEffect(() => {
    if (token) {
      localStorage.setItem('lastfm_token', token)
    }
    navigate({ to: '/stats' })
  }, [token, navigate])

  return null
}

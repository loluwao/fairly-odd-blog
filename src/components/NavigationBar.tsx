import { Button, Stack } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'

export default function NavigationBar() {
  const navigate = useNavigate()

  const handleStatsClick = () => {
    // const token = localStorage.getItem('lastfm_token')
    // if (token) {
    navigate({ to: '/stats' })
    // } else {
    //   const callbackUrl = `${window.location.origin}/stats/callback`
    //   const authUrl = `https://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&cb=${encodeURIComponent(callbackUrl)}`
    //   window.location.href = authUrl
    // }
  }

  return (
    <Stack width={60} padding={4}>
      <Button onClick={() => navigate({ to: '/blog' })}>Reviews</Button>
      <Button onClick={handleStatsClick}>Stats</Button>
    </Stack>
  )
}

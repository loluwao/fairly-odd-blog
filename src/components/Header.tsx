import { Button, Stack } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'

export default function Header() {
  const navigate = useNavigate()
  return (
    <Stack width={60} padding={4}>
      <Button onClick={() => navigate({ to: '/reviews' })}>Reviews</Button>
    </Stack>
  )
}

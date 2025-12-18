import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const PageWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

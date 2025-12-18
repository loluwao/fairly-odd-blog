import { PageWrapper } from '@/components/PageWrapper'
import { ReviewsPage } from '@/reviews/ReviewsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reviews/')({
  component: () => (
    <PageWrapper>
      <ReviewsPage />
    </PageWrapper>
  ),
  // errorComponent: <ErrorPage />
})

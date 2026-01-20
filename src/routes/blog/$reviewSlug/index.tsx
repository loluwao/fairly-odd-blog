import { createFileRoute } from '@tanstack/react-router'

import { PostPage } from '../../../blog/PostPage'
import { PageWrapper } from '../../../components/PageWrapper'

export const Route = createFileRoute('/blog/$reviewSlug/')({
  component: () => (
    <PageWrapper>
      <PostPage/>
    </PageWrapper>
  ),
})

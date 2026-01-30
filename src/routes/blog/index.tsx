import { createFileRoute } from '@tanstack/react-router';

import { BlogPage } from '../../blog/BlogPage';
import { PageWrapper } from '../../components/PageWrapper';

export const Route = createFileRoute('/blog/')({
  component: () => (
    <PageWrapper>
      <BlogPage />
    </PageWrapper>
  ),
  // errorComponent: <ErrorPage />
});

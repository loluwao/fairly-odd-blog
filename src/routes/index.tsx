import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../components/PageWrapper';
import { BlogPage } from '../blog/BlogPage';

export const Route = createFileRoute('/')({
  component: () => (
    <PageWrapper>
      <BlogPage />
    </PageWrapper>
  ),
});

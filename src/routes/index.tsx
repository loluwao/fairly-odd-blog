import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../components/PageWrapper';
import { HomePage } from '../pages/Home';

export const Route = createFileRoute('/')({
  component: () => (
    <PageWrapper>
      <HomePage />
    </PageWrapper>
  ),
});

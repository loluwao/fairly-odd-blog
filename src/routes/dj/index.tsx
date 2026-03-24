import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../../components/PageWrapper';
import { DJPage } from '../../dj/DJPage';

export const Route = createFileRoute('/dj/')({
  component: () => (
    <PageWrapper>
      <DJPage />
    </PageWrapper>
  ),
});

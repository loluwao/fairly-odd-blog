import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../../components/PageWrapper';
import { StatsPage } from '../../stats/StatsPage';

export const Route = createFileRoute('/stats/')({
  component: () => (
    <PageWrapper>
      <StatsPage />
    </PageWrapper>
  ),
});

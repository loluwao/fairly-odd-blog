import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../../../components/PageWrapper';
import { LyricalComplexitynPage } from '../../../stats/LyricalCompPage';

export const Route = createFileRoute('/stats/lyrical-comprehension/')({
  component: () => (
    <PageWrapper>
      <LyricalComplexitynPage />
    </PageWrapper>
  ),
});

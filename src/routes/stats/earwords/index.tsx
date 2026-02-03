import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../../../components/PageWrapper';
import { EarWords } from '../../../stats/EarWordsPage';

export const Route = createFileRoute('/stats/earwords/')({
  component: () => (
    <PageWrapper>
      <EarWords/>
    </PageWrapper>
  ),
});

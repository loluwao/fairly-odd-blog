import { createFileRoute } from '@tanstack/react-router';
import { PageWrapper } from '../../../components/PageWrapper';
import { VisualMixPage } from '../../../dj/VisualMixPage';

export const Route = createFileRoute('/dj/$id/')({
  component: () => (
    (
      <PageWrapper>
        <VisualMixPage/>
      </PageWrapper>
    )
  ),
});

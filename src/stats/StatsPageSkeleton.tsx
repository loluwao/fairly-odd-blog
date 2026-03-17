import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';
import type { ReactNode } from 'react';

export const StatsPageSkeleton: React.FC<{ header: string;
  subheader?: string;
  formFields: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  actions?: ReactNode; // additional actions rendered left of the submit button
  submitted: boolean;
  isLoading: boolean;
  loadingMessage?: string;
  hasError: boolean;
  result: ReactNode; }> = ({
  header,
  subheader,
  formFields,
  onSubmit,
  submitLabel = 'GO',
  actions,
  submitted,
  isLoading,
  loadingMessage = 'loading...',
  hasError,
  result,
}) => {
  return (
    <PageLayout
      header={header}
      subheader={subheader}
      content={
        <Stack width={'100%'} padding={4} alignItems={'center'}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: '', md: 'center' }} mb={2}>
            {formFields}
            <Button variant="contained" onClick={onSubmit}>
              {submitLabel}
            </Button>
            {actions}
          </Stack>
          {!submitted ? null
            : isLoading ? (
              <>
                <CircularProgress />
                <Typography color={theme.palette.color.white}>{loadingMessage}</Typography>
              </>
            )
              : hasError ? (
                <Typography color={theme.palette.color.neonPink}>Something went wrong :(</Typography>
              )
                : result}
        </Stack>
      }
    />
  );
};

import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '../theme';
import type { ReactNode } from 'react';

export const PageWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {children}</QueryClientProvider>
    </ThemeProvider>
  );
};

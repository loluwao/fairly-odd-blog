import { Stack, Typography } from '@mui/material';
import theme from '../theme';
import { Footer } from './Footer';
import type { ReactNode } from 'react';

export const PageLayout: React.FC<{
  header?: string;
  subheader?: string;
  content: ReactNode;

}> = ({ header, subheader, content }) => {
  return (
    <Stack padding={1} alignItems={'center'} gap={5} sx={{ minHeight: '100dvh' }}>
      <Stack sx={{ width: '80%', alignItems: 'center' }}>
        <Stack width={'100%'} gap={1}>
          {header && <Typography variant="h1" color={theme.palette.color.white} >{header}</Typography>}
          {subheader && <Typography variant='subtitle1' color={theme.palette.color.whiteAlpha70}>{subheader}</Typography>}
        </Stack>
        {content}
      </Stack>
      <Footer />
    </Stack>
  );
};

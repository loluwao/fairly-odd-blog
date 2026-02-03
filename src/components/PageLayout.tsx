import { Box, Stack, Typography } from '@mui/material';
import theme from '../theme';
import { Footer } from './Footer';
import type { ReactNode } from 'react';

export const PageLayout: React.FC<{
  header: string;
  subheader?: string;
  content: ReactNode;

}> = ({ header, subheader, content }) => {
  return (
    <Stack padding={4} alignItems={'center'} gap={5} sx={{ minHeight: '100dvh' }}>
      <Stack sx={{ flex: 1, width: '100%', alignItems: 'center' }}>
        <Stack maxWidth={800} width='100%' alignItems={'center'} px={2}>
          <Box width={'90%'}><Typography variant="h1" textAlign={'center'} color={theme.palette.color.neonPink} sx={{ fontSize: { xs:  '3rem', md: '4rem' } }}>{header}</Typography></Box>
          {subheader && <Typography variant='body2' color={theme.palette.color.white}>{subheader}</Typography>}
          {/* <img src={'/fairlyodd-logo-white.png'} width={20}/> */}
        </Stack>
        {content}
      </Stack>
      <Footer />
    </Stack>
  );
};

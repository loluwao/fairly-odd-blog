import { Stack, Typography } from '@mui/material';
import theme from '../theme';
import type { ReactNode } from 'react';

export const PageLayout: React.FC<{
  header: string;
  subheader?: string;
  content: ReactNode;

}> = ({ header, subheader, content }) => {
  return (
    <Stack margin={4} alignItems={'center'}>
      <Stack width={800} overflow={'clip'} alignItems={'center'} gap={0.5}>
        <Typography variant="h1" color={theme.palette.color.neonGreen}>{header}</Typography>
        {subheader && <Typography variant='body1' color={theme.palette.color.white}>{subheader}</Typography>}
        {/* <img src={'/fairlyodd-logo.png'} width={40}/> */}
      </Stack>
      {content}
    </Stack>
  );
};

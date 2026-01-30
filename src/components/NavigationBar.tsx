import { Stack } from '@mui/material';

import theme from '../theme';

import { MyLink } from './MyLink';

export const NavigationBar: React.FC = () => {
  return (
    <Stack width={60} gap={5} padding={10} sx={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
      <MyLink href='/blog' color={theme.palette.color.neonPink} text='BLOG' />
      <MyLink href='/stats' color={theme.palette.color.neonPink} text='STATS' />
    </Stack>
  );
};

import { Box } from '@mui/material';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { NavigationBar } from '../components/NavigationBar';
import theme from '../theme';
import { LatestBanner } from '../components/LatestBanner';

export const Route = createRootRoute({
  component: () => (
    <Box
      sx={{
        backgroundColor: `${theme.palette.color.darkGray}`,
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LatestBanner />
      <NavigationBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </Box>
  ),
});

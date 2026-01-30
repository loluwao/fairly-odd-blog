import { Box } from '@mui/material';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { NavigationBar } from '../components/NavigationBar';
import theme from '../theme';

export const Route = createRootRoute({
  component: () => (
    <Box
      sx={{
        backgroundColor: `${theme.palette.color.darkGray}`,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
        }}
      >
        <NavigationBar />
      </Box>
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

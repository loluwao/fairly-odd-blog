import { useState } from 'react';
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from '@tanstack/react-router';
import theme from '../theme';

const NAV_LINKS = [
  { href: '/blog', text: 'BLOG' },
  { href: '/stats', text: 'STATS' },
];

export const NavigationBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  // const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // if (isDesktop) {
  //   return (
  //     <Stack width={60} gap={5} padding={10} sx={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
  //       {NAV_LINKS.map((link) => (
  //         <MyLink key={link.href} href={link.href} color={theme.palette.color.neonPink} text={link.text} />
  //       ))}
  //     </Stack>
  //   );
  // }

  return (
    <>
      <IconButton
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 1100,
          color: theme.palette.color.neonPink,
          width: 44,
          height: 44,
          bgcolor: '#0a0a0a',
          border: '1px solid rgba(219, 64, 118, 0.3)',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          '&:hover': {
            bgcolor: '#141414',
            borderColor: theme.palette.color.neonPink,
          },
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 10, 10, 0.97)',
            backdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(219, 64, 118, 0.2)',
            width: 150,
            padding: 0,
          },
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}>

            <IconButton
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              sx={{
                color: theme.palette.color.whiteAlpha50,
                width: 32,
                height: 32,
                '&:hover': { color: theme.palette.color.neonPink },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Stack gap={0.5} sx={{ px: 1.5, py: 2 }}>
            {NAV_LINKS.map((link) => (
              <Box
                key={link.href}
                component={Link}
                to={link.href}
                onClick={() => setOpen(false)}
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(219, 64, 118, 0.08)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    color: theme.palette.color.whiteAlpha70,
                    '.MuiBox-root:hover &': {
                      color: theme.palette.color.neonPink,
                    },
                  }}
                >
                  {link.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

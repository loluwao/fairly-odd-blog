import { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
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
  return (
    <Stack position={'fixed'} zIndex={1000} width={'100%'} height={'100%'}>
      <IconButton
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: 12,
          right: 12,
          color: theme.palette.color.neonPink,
          width: 44,
          height: 44,
          bgcolor: '#0a0a0a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          visibility: open ? 'hidden' : 'visible',
          '&:hover': {
            bgcolor: '#141414',
            borderColor: theme.palette.color.neonPink,
          },
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
      <Stack bgcolor={theme.palette.color.darkGray} height={'100%'}
        alignItems={'center'} justifyContent={'center'}
        sx={{
          opacity: 0.9,
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.5s cubic-bezier(0.25,0.1,0.25,1)',
        }}>
        <IconButton
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          sx={{
            position: 'fixed',
            right: 10,
            top: 10,
            color: theme.palette.color.whiteAlpha50,
            width: 32,
            height: 32,
            '&:hover': { color: theme.palette.color.neonPink },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        {NAV_LINKS.map((link) => (
          <Box
            key={link.href}
            component={Link}
            to={link.href}
            onClick={() => setOpen(false)}
            sx={{
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
                },
              }}
            >
              {link.text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );

};

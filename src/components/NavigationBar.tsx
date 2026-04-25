import { Link } from '@tanstack/react-router';
import { Box, Stack, Typography } from '@mui/material';
import theme from '../theme';

const NAV_LINKS = [
  { href: '/blog', text: 'BLOG' },
  { href: '/stats', text: 'STATS' },
  { href: '/dj', text: 'DJ' },
];

export const NavigationBar: React.FC = () => {
  return (
    <Box component={'nav'} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-end'} width={'100%'} position={'sticky'} paddingTop={2}>
      <Stack flexDirection={'row'} alignContent={'center'}>
        {NAV_LINKS.map((link) => (
          <Box
            key={link.href}
            component={Link}
            to={link.href}
            px={2}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.color.whiteAlpha70,
                '&:hover': {
                  color: theme.palette.color.neonGreen,
                  transform: '0.3s',
                },
              }}
            >
              {link.text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';
import { TRACKS } from './tracks';

export const DJPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      header="DJ"
      subheader='Listen to the practice mixes I chose to put here!'
      content={
        <Stack alignItems="center" width="100%" mt={2}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
              width: '100%',
              maxWidth: 900,
              px: 2,
            }}
          >
            {TRACKS.map(track => (
              <Box
                key={track.id}
                onClick={() => navigate({ to: '/dj/$id', params: { id: track.id } })}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `0.5px solid ${theme.palette.color.whiteAlpha50}`,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.color.neonPink,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.color.white}
                  sx={{ fontWeight: 500 }}
                >
                  {track.title}
                </Typography>
                <Typography variant="body2" color={theme.palette.color.whiteAlpha50} sx={{ mt: 0.5, fontSize: 11 }}>
                  {track.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      }
    />
  );
};

import { Box, Stack, Typography } from '@mui/material';
import theme from '../theme';
import { useNowPlaying } from '../stats/queries';
import { TRACKS } from '../dj/tracks';

export const LatestBanner: React.FC = () => {
  const { data: np, isLoading } = useNowPlaying();
  let npMessage = isLoading ? '' : np?.nowPlaying ? 'NOW LISTENING TO: ' : 'WAS LISTENING TO: ';
  if (!np) {
    npMessage += 'NOTHING';
  } else {
    npMessage += np.name + ' - ' + np.artist;
  }

  const djMessage = 'latest djing from me: ' + TRACKS.at(0)?.title;
  return (
    <Box
      sx={{
        bgcolor: theme.palette.color.neonPink,
        overflow: 'hidden',
        width: '100%',
        py: 0.5,
        whiteSpace: 'nowrap',
      }}>
      <Box
        sx={{
          display: 'inline-block',
          animation: 'marquee 20s linear infinite',
          '@keyframes marquee': {
            '0%': { transform: 'translateX(100vw)' },
            '100%': { transform: 'translateX(-100%)' },
          },
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}>
        <Stack direction={'row'} flexWrap={'nowrap'}>
          <Typography variant="body2">{npMessage}</Typography>
          <Stack width={300} />
          <Typography variant="body2">{djMessage}</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

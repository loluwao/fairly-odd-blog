import { Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import NumberField from '../components/NumberField';
import theme from '../theme';
import { useComplexity, useTopTracks } from './queries';
import { useSpotifyAuth } from './spotify/useSpotifyAuth';
import { useSpotifyComplexity, useSpotifyTopTracks } from './spotify/queries';
import { spotifyTimeRangeOptions } from './spotify/types';
import { StatsPageSkeleton } from './StatsPageSkeleton';
import { timeFrameOptions } from './types';
import type { SpotifyTimeRange } from './spotify/types';
import type { ComplexityResult, Source, TimeFrame } from './types';

export const LyricalComplexitynPage: React.FC = () => {
  const { isAuthenticated, login, logout, getValidToken } = useSpotifyAuth();

  const [source, setSource] = useState<Source>('lastfm');
  const [inputUser, setInputUser] = useState('');
  const [inputLastfmTimeFrame, setInputLastfmTimeFrame] = useState<TimeFrame>('7day');
  const [inputSpotifyTimeRange, setInputSpotifyTimeRange] = useState<SpotifyTimeRange>('short_term');
  const [limit, setLimit] = useState(20);

  const [submitted, setSubmitted] = useState(false);
  const [queryUser, setQueryUser] = useState('');
  const [queryLastfmTimeFrame, setQueryLastfmTimeFrame] = useState<TimeFrame>('7day');
  const [querySpotifyTimeRange, setQuerySpotifyTimeRange] = useState<SpotifyTimeRange>('short_term');
  const [queryLimit, setQueryLimit] = useState(20);

  const { data: lastfmTracks, isLoading: lastfmTracksLoading } = useTopTracks(
    queryUser, queryLastfmTimeFrame, queryLimit,
    { enabled: source === 'lastfm' && submitted && !!queryUser },
  );
  const { data: spotifyTracks, isLoading: spotifyTracksLoading } = useSpotifyTopTracks(
    getValidToken, querySpotifyTimeRange, queryLimit,
    { enabled: source === 'spotify' && submitted },
  );

  const { data: lastfmResults, isLoading: lastfmResultsLoading } = useComplexity(
    source === 'lastfm' ? (lastfmTracks ?? []) : [],
  );
  const { data: spotifyResults, isLoading: spotifyResultsLoading } = useSpotifyComplexity(
    source === 'spotify' ? (spotifyTracks ?? []) : [],
  );

  const results = source === 'lastfm' ? lastfmResults : spotifyResults;
  const tracksLoading = source === 'lastfm' ? lastfmTracksLoading : spotifyTracksLoading;
  const resultsLoading = source === 'lastfm' ? lastfmResultsLoading : spotifyResultsLoading;

  const handleSourceChange = (_: React.MouseEvent, val: Source | null) => {
    if (!val) return;
    setSource(val);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (source === 'spotify' && !isAuthenticated) {
      login('/stats/lyrical-complexity');
      return;
    }
    setQueryUser(inputUser);
    setQueryLastfmTimeFrame(inputLastfmTimeFrame);
    setQuerySpotifyTimeRange(inputSpotifyTimeRange);
    setQueryLimit(limit);
    setSubmitted(true);
  };

  const isLoading = tracksLoading || resultsLoading;
  const hasError = !isLoading && submitted && (!results || results.length === 0);
  const loadingMessage = tracksLoading ? 'getting tracks...' : 'analyzing lyrics...';
  const submitLabel = source === 'spotify' && !isAuthenticated ? 'Connect Spotify' : 'GO';

  return (
    <StatsPageSkeleton
      header={'LYRICAL COMPLEXITY'}
      subheader={'How complex are the lyrics you listen to?'}
      submitted={submitted}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      hasError={hasError}
      result={results && results.length > 0 ? <ComplexityDisplay results={results} /> : null}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      actions={source === 'spotify' && isAuthenticated ? (
        <Button variant="text" size="small" sx={{ color: theme.palette.color.whiteAlpha70 }} onClick={logout}>
          Disconnect
        </Button>
      ) : undefined}
      formFields={
        <>
          <ToggleButtonGroup
            value={source}
            exclusive
            onChange={handleSourceChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': { color: theme.palette.color.whiteAlpha70, borderColor: theme.palette.color.whiteAlpha50 },
              '& .MuiToggleButton-root.Mui-selected': { color: theme.palette.color.white, bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ToggleButton value="lastfm">Last.fm</ToggleButton>
            <ToggleButton value="spotify">Spotify</ToggleButton>
          </ToggleButtonGroup>

          {source === 'lastfm' && (
            <TextField
              variant='standard'
              label="Last.fm Username"
              sx={{ width: { xs: '100%', md: 200 } }}
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
            />
          )}

          {(source === 'lastfm' || isAuthenticated) && (
            <>
              <FormControl variant="standard" sx={{
                width: { xs: '100%', md: 150 },
                '& .MuiInputLabel-root': { color: theme.palette.color.whiteAlpha70 },
                '& .MuiInput-underline:before': { borderBottomColor: theme.palette.color.whiteAlpha50 },
                '& .MuiInput-underline:hover:before': { borderBottomColor: theme.palette.color.white },
              }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={source === 'lastfm' ? inputLastfmTimeFrame : inputSpotifyTimeRange}
                  onChange={(e) => {
                    if (source === 'lastfm') setInputLastfmTimeFrame(e.target.value as TimeFrame);
                    else setInputSpotifyTimeRange(e.target.value as SpotifyTimeRange);
                  }}
                  label="Timeframe"
                  sx={{ color: theme.palette.color.white, '& .MuiSvgIcon-root': { color: theme.palette.color.white } }}
                >
                  {(source === 'lastfm' ? timeFrameOptions : spotifyTimeRangeOptions).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <NumberField
                label="Number of tracks"
                min={5}
                max={50}
                value={limit}
                onValueChange={(val) => setLimit(val ?? 20)}
                sx={{
                  '& .MuiInputBase-input': { color: theme.palette.color.white },
                  '& .MuiInputLabel-root': { color: theme.palette.color.whiteAlpha70 },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.color.whiteAlpha50 },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.color.white },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.color.white },
                  '& .MuiIconButton-root': { color: theme.palette.color.whiteAlpha70 },
                }}
              />
            </>
          )}
        </>
      }
    />
  );
};

export function getScoreColor(score: number): string {
  if (score >= 70) return theme.palette.color.neonGreen;
  if (score >= 50) return theme.palette.color.gold;
  if (score >= 30) return theme.palette.color.coral;
  return theme.palette.color.neonPink;
}

export const ComplexityDisplay: React.FC<{ results: ComplexityResult[] }> = ({ results }) => {
  const sorted = useMemo(() => [...results].sort((a, b) => b.score - a.score), [results]);

  return (
    <Stack gap={4} alignItems="center" py={4} width="100%" maxWidth={700}>
      <Stack gap={1.5} width="100%">
        {sorted.map((result, idx) => (
          <Tooltip
            key={`${result.artist}-${result.title}`}
            title={
              <Stack gap={0.5} p={0.5}>
                <Typography variant="caption" sx={{ color: theme.palette.color.white }}>Vocab diversity: {result.vocabulary_diversity}</Typography>
                <Typography variant="caption" sx={{ color: theme.palette.color.white }}>Avg word length: {result.average_word_length}</Typography>
                <Typography variant="caption" sx={{ color: theme.palette.color.white }}>Rare word ratio: {result.rare_word_ratio}</Typography>
                <Typography variant="caption" sx={{ color: theme.palette.color.white }}>{result.unique_words} unique / {result.total_words} total words</Typography>
              </Stack>
            }
            arrow
            placement="top"
            slotProps={{
              tooltip: { sx: { bgcolor: theme.palette.color.blackAlpha85, maxWidth: 250 } },
              arrow: { sx: { color: theme.palette.color.blackAlpha85 } },
            }}
          >
            <Stack direction="row" alignItems="center" gap={2} sx={{
              py: 1,
              px: 2,
              borderRadius: 2,
              cursor: 'default',
              transition: 'background 0.2s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.color.silver, width: 24, textAlign: 'right', flexShrink: 0 }}>
                {idx + 1}
              </Typography>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{
                  color: theme.palette.color.white,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {result.title}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.color.silver }}>
                  {result.artist}
                </Typography>
              </Stack>
              <Box sx={{ flex: 1, minWidth: 80 }}>
                <LinearProgress
                  variant="determinate"
                  value={result.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: getScoreColor(result.score),
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: getScoreColor(result.score), fontWeight: 700, width: 40, textAlign: 'right', flexShrink: 0 }}>
                {result.score}
              </Typography>
            </Stack>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
};

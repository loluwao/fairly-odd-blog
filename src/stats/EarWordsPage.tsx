import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import NumberField from '../components/NumberField';
import theme from '../theme';
import { useTopTracks, useTopWords } from './queries';
import { useSpotifyAuth } from './spotify/useSpotifyAuth';
import { useSpotifyTopTracks, useSpotifyTopWords } from './spotify/queries';
import { spotifyTimeRangeOptions } from './spotify/types';
import { StatsPageSkeleton } from './StatsPageSkeleton';
import { timeFrameOptions } from './types';
import type { SpotifyTimeRange } from './spotify/types';
import type { Source, TimeFrame, TopWordsResponse } from './types';

export const EarWords: React.FC = () => {
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

  // call both hooks but unused one will just b empty
  const { data: lastfmTracks, isLoading: lastfmTracksLoading } = useTopTracks(
    queryUser, queryLastfmTimeFrame, queryLimit,
    { enabled: source === 'lastfm' && submitted && !!queryUser },
  );
  const { data: spotifyTracks, isLoading: spotifyTracksLoading } = useSpotifyTopTracks(
    getValidToken, querySpotifyTimeRange, queryLimit,
    { enabled: source === 'spotify' && submitted },
  );

  const { data: lastfmTopWords, isLoading: lastfmWordsLoading } = useTopWords(
    source === 'lastfm' ? (lastfmTracks ?? []) : [],
  );
  const { data: spotifyTopWords, isLoading: spotifyWordsLoading } = useSpotifyTopWords(
    source === 'spotify' ? (spotifyTracks ?? []) : [],
  );

  const topWords = source === 'lastfm' ? lastfmTopWords : spotifyTopWords;
  const tracksLoading = source === 'lastfm' ? lastfmTracksLoading : spotifyTracksLoading;
  const wordsLoading = source === 'lastfm' ? lastfmWordsLoading : spotifyWordsLoading;

  const handleSourceChange = (_: React.MouseEvent, val: Source | null) => {
    if (!val) return;
    setSource(val);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (source === 'spotify' && !isAuthenticated) {
      login('/stats/earwords');
      return;
    }
    setQueryUser(inputUser);
    setQueryLastfmTimeFrame(inputLastfmTimeFrame);
    setQuerySpotifyTimeRange(inputSpotifyTimeRange);
    setQueryLimit(limit);
    setSubmitted(true);
  };

  const isLoading = tracksLoading || wordsLoading;
  const hasError = !isLoading && submitted && (!topWords || topWords.words.length === 0);
  const loadingMessage = tracksLoading ? 'getting tracks...' : 'analyzing lyrics...';
  const submitLabel = source === 'spotify' && !isAuthenticated ? 'Connect Spotify' : 'GO';

  return (
    <StatsPageSkeleton
      header={'EAR WORM(D)S..?'}
      subheader={'Most frequent words from your most frequent songs!!!'}
      submitted={submitted}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      hasError={hasError}
      result={topWords && topWords.words.length > 0 ? <WordCountDisplay topWords={topWords} /> : null}
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

const colors = [
  theme.palette.color.coral, theme.palette.color.teal, theme.palette.color.skyBlue, theme.palette.color.sage, theme.palette.color.butter,
  theme.palette.color.plum, theme.palette.color.mint, theme.palette.color.gold, theme.palette.color.lavender, theme.palette.color.lightBlue,
  theme.palette.color.amber, theme.palette.color.salmon, theme.palette.color.aqua, theme.palette.color.yellow, theme.palette.color.green,
];

export const WordCountDisplay: React.FC<{ topWords: TopWordsResponse }> = ({ topWords }) => {
  const maxCount = topWords.words[0]?.count ?? 1;
  const minCount = topWords.words[topWords.words.length - 1]?.count ?? 1;

  const getWordStyle = useMemo(() => {
    return (count: number, index: number) => {
      const normalized = (count - minCount) / (maxCount - minCount || 1);
      const fontSize = 1 + normalized * 3.5;
      const color = colors[index % colors.length];
      const rotation = (Math.random() - 0.5) * 10;

      return {
        fontSize: `${fontSize}rem`,
        color,
        fontWeight: normalized > 0.5 ? 700 : 500,
        transform: `rotate(${rotation}deg)`,
        transition: 'all 0.3s ease',
        cursor: 'default',
        textShadow: normalized > 0.7 ? `0 0 20px ${color}40` : 'none',
        '&:hover': {
          transform: 'scale(1.15) rotate(0deg)',
          zIndex: 10,
        },
      };
    };
  }, [maxCount, minCount]);

  const shuffledWords = useMemo(() => {
    return [...topWords.words].sort(() => Math.random() - 0.5);
  }, [topWords.words]);

  return (
    <Box gap={4} alignItems="center" py={4}>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.color.silver,
          textTransform: 'uppercase',
          letterSpacing: 2,
          textAlign: 'center',
          mb: 3,
        }}
      >
        {topWords.total_tokens.toLocaleString()} unique words found
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 1.5, md: 2.5 },
          maxWidth: 900,
          padding: { xs: 2, md: 4 },
          borderRadius: 4,
          bgcolor: 'none',
        }}
      >
        {shuffledWords.map((word, idx) => (
          <Tooltip
            key={word.word}
            title={word.count}
            arrow
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: theme.palette.color.blackAlpha85,
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                },
              },
              arrow: { sx: { color: theme.palette.color.blackAlpha85 } },
            }}
          >
            <Box
              component="span"
              sx={{
                ...getWordStyle(word.count, idx),
                display: 'inline-block',
                padding: '4px 12px',
                lineHeight: 1.2,
                position: 'relative',
              }}
            >
              {word.word}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import NumberField from '../components/NumberField';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';
import { useTopTracks, useTopWords } from './queries';
import type { TimeFrame, TopWordsResponse } from './types';

const timeFrameOptions: { value: TimeFrame; label: string }[] = [
  { value: '7day', label: 'Last 7 Days' },
  { value: '1month', label: 'Last Month' },
  { value:  '3month', label: 'Last 3 Months' },
  { value: '6month', label: 'Last 6 Months' },
  { value: '12month', label: 'Last Year' },
  { value: 'overall', label: 'All Time' },
];

export const EarWords: React.FC = () => {
  const [inputUser, setInputUser] = useState('');
  const [inputTimeFrame, setInputTimeFrame] = useState<TimeFrame>('7day');
  const [limit, setLimit] = useState(20);

  const [queryUser, setQueryUser] = useState<string | null>(null);
  const [queryTimeFrame, setQueryTimeFrame] = useState<TimeFrame>('7day');
  const [queryLimit, setQueryLimit] = useState(20);

  const { data: tracks, isLoading: tracksLoading } = useTopTracks(queryUser ?? '', queryTimeFrame, queryLimit, { enabled: !!queryUser });
  const { data: topWords, isLoading: wordsLoading } = useTopWords(tracks ?? []);

  const handleSubmit = () => {
    setQueryUser(inputUser);
    setQueryTimeFrame(inputTimeFrame);
    setQueryLimit(limit);
  };

  return (
    <PageLayout
      header={'EAR WORM(D)S..?'}
      subheader={'Most frequent words from your most frequent songs!!!'}
      content={<Stack width={'100%'} padding={4} alignItems={'center'}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: '', md: 'center' }} mb={2} >
          <TextField
            variant='standard'
            label="Last.fm Username"
            sx={{ width: { xs: '100%', md: 200 } }}
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
          />
          <FormControl variant="standard" sx={{
            width: { xs: '100%', md: 150 },
            '& .MuiInputLabel-root': { color: theme.palette.color.whiteAlpha70 },
            '& .MuiInput-underline:before': { borderBottomColor: theme.palette.color.whiteAlpha50 },
            '& .MuiInput-underline:hover:before': { borderBottomColor: theme.palette.color.white },
          }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={inputTimeFrame}
              onChange={(e) => setInputTimeFrame(e.target.value as TimeFrame)}
              label="Timeframe"
              sx={{ color: theme.palette.color.white, '& .MuiSvgIcon-root': { color: theme.palette.color.white } }}
            >
              {timeFrameOptions.map((option) => (
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
          <Button variant="contained" onClick={handleSubmit}>
            GO
          </Button>
        </Stack>
        {!queryUser ? <></>
          : !tracksLoading && !wordsLoading && topWords && topWords.words.length > 0 ?
            <WordCountDisplay topWords={topWords} />
            : tracksLoading ? <><CircularProgress/><Typography color={theme.palette.color.white}>getting tracks...</Typography></>
              : wordsLoading ? <><CircularProgress/><Typography color={theme.palette.color.white}>analyzing lyrics...</Typography></>
                : <Typography color={theme.palette.color.neonPink}>Something went wrong :((</Typography>}
      </Stack>}
    />
  );

};

const colors = [
  theme.palette.color.coral, theme.palette.color.teal, theme.palette.color.skyBlue, theme.palette.color.sage, theme.palette.color.butter,
  theme.palette.color.plum, theme.palette.color.mint, theme.palette.color.gold, theme.palette.color.lavender, theme.palette.color.lightBlue,
  theme.palette.color.amber, theme.palette.color.salmon, theme.palette.color.aqua, theme.palette.color.yellow, theme.palette.color.green,
];

const WordCountDisplay: React.FC<{ topWords: TopWordsResponse }> = ({ topWords }) => {
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
    <Stack gap={4} alignItems="center" py={4}>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.color.silver,
          textTransform: 'uppercase',
          letterSpacing: 2,
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
              arrow: {
                sx: {
                  color: theme.palette.color.blackAlpha85,
                },
              },
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
    </Stack>
  );
};

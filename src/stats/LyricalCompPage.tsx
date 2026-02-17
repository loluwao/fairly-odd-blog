import { Box, Button, CircularProgress, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import NumberField from '../components/NumberField';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';
import { useComplexity, useTopTracks } from './queries';
import { timeFrameOptions } from './types';
import type { ComplexityResult, TimeFrame } from './types';

export const LyricalComplexitynPage: React.FC = () => {
  const [inputUser, setInputUser] = useState('');
  const [inputTimeFrame, setInputTimeFrame] = useState<TimeFrame>('7day');
  const [limit, setLimit] = useState(20);

  const [queryUser, setQueryUser] = useState<string | null>(null);
  const [queryTimeFrame, setQueryTimeFrame] = useState<TimeFrame>('7day');
  const [queryLimit, setQueryLimit] = useState(20);

  const { data: tracks, isLoading: tracksLoading } = useTopTracks(queryUser ?? '', queryTimeFrame, queryLimit, { enabled: !!queryUser });
  const { data: results, isLoading: resultsLoading } = useComplexity(tracks ?? []);

  const handleSubmit = () => {
    setQueryUser(inputUser);
    setQueryTimeFrame(inputTimeFrame);
    setQueryLimit(limit);
  };

  return (
    <PageLayout
      header={'LYRICAL COMPLEXITY'}
      subheader={'How complex are the lyrics you listen to?'}
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
          : !tracksLoading && !resultsLoading && results && results.length > 0 ?
            <ComplexityDisplay results={results} />
            : tracksLoading ? <><CircularProgress /><Typography color={theme.palette.color.white}>getting tracks...</Typography></>
              : resultsLoading ? <><CircularProgress /><Typography color={theme.palette.color.white}>analyzing lyrics...</Typography></>
                : <Typography color={theme.palette.color.neonPink}>Something went wrong :(</Typography>}
      </Stack>}
    />
  );
};

function getScoreColor(score: number): string {
  if (score >= 70) return theme.palette.color.neonGreen;
  if (score >= 50) return theme.palette.color.gold;
  if (score >= 30) return theme.palette.color.coral;
  return theme.palette.color.neonPink;
}

const ComplexityDisplay: React.FC<{ results: ComplexityResult[] }> = ({ results }) => {
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

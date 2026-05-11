import { Box, Stack, Typography } from '@mui/material';
import theme from '../theme';
import { formatDate } from '../blog/utils';
import type { SxProps, Theme } from '@mui/material';

export const ArticleCard: React.FC<{
  header: string
  previewText: string
  imgSrc: string
  onClick: () => void
  date: string;
  sx?: SxProps<Theme>
}> = ({ header, previewText, imgSrc, date, onClick, sx }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: { xs: '85vw', sm: 500 },
        ...sx,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        transition: 'ease-in-out 0.2s',
        '&:hover': {
          borderColor: theme.palette.color.neonGreen + '60',
          cursor: 'pointer',
          '& .preview-text': {
            opacity: 1,
            maxHeight: 100,
          },
        },
      }}
    >
      <img src={imgSrc} height={100} alt={`cover image for ${header}`} />
      <Stack margin={2} gap={1} >
        <Typography variant="h3" color={theme.palette.color.neonGreen}>{header}</Typography>
        <Typography
          className="preview-text"
          variant="caption"
          color={theme.palette.color.white}
          sx={{ opacity: 0, maxHeight: 0, overflow: 'hidden', transition: 'opacity 0.2s ease-in-out, max-height 0.2s ease-in-out' }}
        >{previewText}</Typography>
        <Typography variant="caption" color={theme.palette.color.whiteAlpha70} alignSelf={'flex-start'}>{formatDate(date)}</Typography>
      </Stack>
    </Box>
  );
};

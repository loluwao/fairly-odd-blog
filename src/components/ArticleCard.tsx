import { Card, Stack, Typography } from '@mui/material';
import theme from '../theme';
import type { SxProps, Theme } from '@mui/material';

export const ArticleCard: React.FC<{
  header: string
  previewText: string
  imgSrc: string
  onClick: () => void
  sx?: SxProps<Theme>
}> = ({ header, previewText, imgSrc, onClick, sx }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: { xs: '85vw', sm: 500 },
        ...sx,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        transition: 'all ease-in-out 0.2s;',
        '&:hover': {
          borderColor: theme.palette.color.neonPink,
          cursor: 'pointer',
        },
      }}
    >
      <img src={imgSrc} height={100} alt={`cover image for ${header}`} />
      <Stack margin={2} gap={1}>
        <Typography variant="h2" color={theme.palette.color.darkGray}>{header}</Typography>
        <Typography variant="body1" color={theme.palette.color.darkGray}>{previewText}</Typography>
      </Stack>
    </Card>
  );
};

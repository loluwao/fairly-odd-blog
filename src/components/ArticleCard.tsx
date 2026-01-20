import { Card, Stack, Typography } from '@mui/material'

import theme from '../theme'

export const ArticleCard: React.FC<{
  header: string
  previewText: string
  imgSrc: string
  onClick: () => void
}> = ({ header, previewText, imgSrc, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 400,
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
      <img src={imgSrc} height={100} />
      <Stack margin={2} gap={1}>
        <Typography variant="h2">{header}</Typography>
        <Typography variant="body1">{previewText}</Typography>
      </Stack>
    </Card>
  )
}

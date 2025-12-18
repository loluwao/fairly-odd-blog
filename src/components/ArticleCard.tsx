import { Card, Stack, Typography } from '@mui/material'

export const ArticleCard: React.FC<{
  header: string
  previewText: string
  imgSrc: string
  onClick: () => void
}> = ({ header, previewText, imgSrc, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ width: 400, borderWidth: 0.5, borderColor: 'black', borderStyle: 'solid',
       transition: '0.2s', 
      '&:hover': {
      //transitionDelay: '0s',
      borderWidth: 1.5,      
    }}}>
      <img src={imgSrc} height={100}  />
      <Stack margin={2}>
      <Typography variant='h4'>{header}</Typography>
      <Typography variant='body1'>{previewText}</Typography>
      </Stack>
    </Card>
  )
}

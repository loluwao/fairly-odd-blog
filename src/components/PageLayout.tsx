import { Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import theme from '../theme'

export const PageLayout: React.FC<{
  header: string;
  subheader?: string;
  content: ReactNode;

}> = ({ header, subheader, content }) => {
  return (
    <Stack gap={0} margin={4} alignItems={'center'}>
      <Stack width={800} overflow={'clip'} alignItems={'center'}>
        <Typography variant="h1" color={theme.palette.color.neonGreen}>{header}</Typography>
        {subheader && <Typography variant='h6' color={theme.palette.color.white}>{subheader}</Typography>}
        <img src={'/stars.svg'}/>
      </Stack>
      {content}
    </Stack>
  )
}

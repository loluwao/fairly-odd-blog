import { List, ListItem, Stack, Typography } from '@mui/material';
import { MyLink } from '../components/MyLink';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';

export const StatsPage: React.FC = () => {
  return (
    <PageLayout
      header={'STATS'}
      content={<Stack width={'100%'} maxWidth={600} gap={5} padding={{ xs: 2, md: 4 }}>
        <List>
          <ListItem sx={{ gap: 1 }}><MyLink color={theme.palette.color.neonPink} text={'Ear words/worms/whatever'} href='/stats/earwords'/>
            <br/>
            <Typography variant='body1'>This takes your selected number of top songs from YOUR SELECTED TIME FRAME and gives you the top words from those songs.</Typography>

          </ListItem>
          <ListItem sx={{ gap: 1 }}><MyLink color={theme.palette.color.neonPink} text={'Lyrical complexity'} href='/stats/lyrical-complexity'/>
            <br/>
            <Typography variant='body1'>This takes your top songs and assigns them a "grade" for their "complexity". It's based on lyrical diversity and length of the words </Typography>
          </ListItem>
          <ListItem><Typography>AND MUCH MORE TO COME</Typography></ListItem>
        </List>
        <Typography variant='caption'>AND A DISCLAIMER: While Genius is the best source for lyrics, it's a community-driven site so the lyrics of your own songs may not be accurate or available. Also the Genius API is a MESS. If you see any weird data it's probably that a song was mismatched with a random page on Genius and you do not listen to a song called "Genius Best Songs of 2017"</Typography>

      </Stack>}
    />
  );

};

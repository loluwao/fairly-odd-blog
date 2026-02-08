import { List, ListItem, Stack, Typography } from '@mui/material';
import { MyLink } from '../components/MyLink';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';

export const StatsPage: React.FC = () => {
  return (
    <PageLayout
      header={'STATS'}
      content={<Stack width={'100%'} maxWidth={600} padding={{ xs: 2, md: 4 }}>
        <List>
          <ListItem><MyLink color={theme.palette.color.neonPink} text={'Ear wordssss:'} href='/stats/earwords'/>
            <Typography variant='body1'>This takes your selected number of top songs from YOUR SELECTED TIME FRAME and gives you the top words from those songs. Right now only works with Last.fm but I'm working on the other streaming platforms</Typography>
          </ListItem>
          <ListItem><Typography>AND MUCH MORE TO COME</Typography></ListItem>
        </List>
      </Stack>}
    />
  );

};

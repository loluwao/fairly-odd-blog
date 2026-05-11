import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { ArticleCard } from '../components/ArticleCard';
import { PageLayout } from '../components/PageLayout';
import { usePosts } from './queries';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: reviews, isLoading, isFetching } = usePosts(1);

  return (
    <PageLayout
      header={'BLOG'}
      subheader={"I'm trying and failing to write one of these a week"}
      content={
        isLoading || isFetching ? (
          <CircularProgress />
        ) : !reviews ? (
          <Typography>Something terrible has happened and the website has failed everyone.</Typography>
        ) : (
          <Stack
            alignContent='center'
            margin={2}
            display='flex'
            alignItems="center"
            justifyContent="center"
            width='100%'
          >
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
              width: '100%',
            }}>
              {reviews.map((article) => (
                <ArticleCard
                  key={article.id}
                  header={article.title}
                  previewText={article.excerpt}
                  imgSrc={article.featured_image}
                  onClick={() => navigate({ to: '/blog/$reviewSlug', params: { reviewSlug: article.slug } })}
                  date={article.date}
                  sx={{ width: '100%' }}
                />
              ))}
            </Box>

          </Stack>
        )}
    />
  );
};

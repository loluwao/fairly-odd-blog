import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { ArticleCard } from '../components/ArticleCard';
import { PageLayout } from '../components/PageLayout';

import { usePosts } from './queries';

export const BlogPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { data: reviews, isLoading, isFetching } = usePosts(1);

  const centerIndex = currentIndex;

  const canGoPrev = currentIndex > 0;
  const canGoNext = reviews ? currentIndex < reviews.length - 1 : false;

  return (
    <PageLayout
      header={'FAIRLY ODD BLOG'}
      subheader={"This is where the writings are...I'm trying and failing to write one a week"}
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
              width: '100%',
              maxWidth: '1200px',
              position: 'relative',
              height: 800,
              overflow: 'hidden',
            }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              >
                {reviews.map((article, idx) => {
                  const offset = idx - centerIndex;
                  const isVisible = offset >= -1 && offset <= 1;
                  const isCenter = offset === 0;

                  return (
                    <Box
                      key={article.id}
                      sx={{
                        position: 'absolute',
                        transition: 'all 0.4s ease-out',
                        left: `${50 + offset * 50}%`,
                        transform: 'translateX(-50%)',
                        opacity: isCenter ? 1 : isVisible ? 0.7 : 0,
                        scale: isCenter ? 1 : 0.9,
                        zIndex: isCenter ? 10 : 1,
                        pointerEvents: isVisible ? 'auto' : 'none',
                      }}
                    >
                      <ArticleCard
                        header={article.title}
                        previewText={article.excerpt}
                        imgSrc={article.featured_image}
                        onClick={() => {
                          if (isCenter) {
                            navigate({ to: '/blog/$reviewSlug', params: { reviewSlug: article.slug } });
                          } else {
                            setCurrentIndex(currentIndex + offset);
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </Box>
            <Stack direction="row" gap={2} marginTop={2}>
              <Button
                variant='contained'
                disabled={!canGoPrev}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                Prev
              </Button>
              <Button
                variant='contained'
                disabled={!canGoNext}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        )}
    />
  );
};

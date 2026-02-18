import { Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import { ArticleCard } from '../components/ArticleCard';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';
import { usePosts } from './queries';

export const BlogPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const navigate = useNavigate();
  const { data: reviews, isLoading, isFetching } = usePosts(1);

  const centerIndex = currentIndex;

  const canGoPrev = currentIndex > 0;
  const canGoNext = reviews ? currentIndex < reviews.length - 1 : false;

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
            <IconButton
              onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
              sx={{
                alignSelf: 'flex-end',
                color: theme.palette.color.whiteAlpha50,
                transition: 'color 0.2s ease',
                '&:hover': { color: theme.palette.color.neonPink },
              }}
            >
              {viewMode === 'carousel' ? <ViewModuleIcon /> : <ViewCarouselIcon />}
            </IconButton>

            {viewMode === 'carousel' ? (
              <>
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
                  <IconButton
                  aria-label='go to previous post'
                    disabled={!canGoPrev}
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    sx={{
                      color: theme.palette.color.softGreen,
                      transition: 'color 0.2s ease',
                      '&:hover': { color: theme.palette.color.neonPink },
                      '&.Mui-disabled': { color: theme.palette.color.whiteAlpha50 },
                    }}
                  >
                    <SkipPreviousIcon />
                  </IconButton>
                  <IconButton
                  aria-label='go to next post'
                    disabled={!canGoNext}
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    sx={{
                      color: theme.palette.color.softGreen,
                      transition: 'color 0.2s ease',
                      '&:hover': { color: theme.palette.color.neonPink },
                      '&.Mui-disabled': { color: theme.palette.color.whiteAlpha50 },
                    }}
                  >
                    <SkipNextIcon />
                  </IconButton>
                </Stack>
              </>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3,
                width: '100%',
                maxWidth: '1200px',
              }}>
                {reviews.map((article) => (
                  <ArticleCard
                    key={article.id}
                    header={article.title}
                    previewText={article.excerpt}
                    imgSrc={article.featured_image}
                    onClick={() => navigate({ to: '/blog/$reviewSlug', params: { reviewSlug: article.slug } })}
                    sx={{ width: '100%' }}
                  />
                ))}
              </Box>
            )}
          </Stack>
        )}
    />
  );
};

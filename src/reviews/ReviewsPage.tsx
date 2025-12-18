import React, { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { useReviews } from './queries'
import { ArticleCard } from '@/components/ArticleCard'

export const ReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const { data: reviews, isLoading, isFetching } = useReviews(page)

  // useEffect(() => {
  //   console.log(reviews)
  // }, [reviews, isFetching, isLoading])

  return isLoading || isFetching ? (
    <p>loading</p>
  ) : !reviews ? (
    <p>err</p>
  ) : (
    <Stack alignContent={'center'} margin={2} display={'flex'} alignItems={'center'}>
    <Stack gridTemplateColumns={'repeat(3, 1fr)'} display={'grid'} gap={5}>
      {reviews.map((review) => (
        <ArticleCard
          header={review.title}
          previewText={review.excerpt}
          imgSrc={review.featuredImage}
          onClick={() => console.log('clicked')}
        />
      ))}
    </Stack>
    </Stack>
  )
}

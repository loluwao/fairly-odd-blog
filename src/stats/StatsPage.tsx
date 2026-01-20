import { useEffect } from 'react'

import { PageLayout } from '../components/PageLayout'

import { useLyrics, useTopTracks } from './queries'

export const StatsPage: React.FC = () => {

  const { data: tracks } = useTopTracks('temitturner', '7day')
  const { data: lyrics } = useLyrics(tracks?.[0]?.artist.name ?? '', tracks?.[0]?.name ?? '')

  useEffect(() => {
    console.log(lyrics)
  }, [lyrics])

  return (
    <PageLayout
      header={'STATS'}
      content={<></>}
    />
  )

}

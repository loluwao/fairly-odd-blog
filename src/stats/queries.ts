import { useQuery } from '@tanstack/react-query';

import type { LyricsResponse, TimeFrame, TopArtist, TopArtistsResponse, TopTrack, TopTracksResponse, TopWordsResponse } from './types';

const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const useTopArtists = (username: string, period: TimeFrame) => {
  return useQuery<TopArtist[]>({
    queryKey: ['top-artists', username, period],
    queryFn: async () => {
      const params = new URLSearchParams({
        method: 'user.gettopartists',
        user: username,
        api_key: LASTFM_API_KEY,
        format: 'json',
        period,
        limit: '10',
      });

      const response = await fetch(`${LASTFM_BASE_URL}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch top artists');
      }

      const data: TopArtistsResponse = await response.json();

      return data.topartists.artist;
    },
    enabled: !!username,
  });
};

export const useTopTracks = (username: string, period: TimeFrame, limit: number, options?: { enabled?: boolean }) => {
  return useQuery<TopTrack[]>({
    queryKey: ['top-tracks', username, period, limit],
    queryFn: async () => {
      if (username.length === 0) return [];
      const params = new URLSearchParams({
        method: 'user.gettoptracks',
        user: username,
        api_key: LASTFM_API_KEY,
        format: 'json',
        period,
        limit: limit.toString(),
      });

      const response = await fetch(`${LASTFM_BASE_URL}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }

      const data: TopTracksResponse = await response.json();

      return data.toptracks.track;
    },
    enabled: options?.enabled ?? !!username,
  });
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const useLyrics = (artist: string, track: string) => {
  return useQuery<LyricsResponse>({
    queryKey: ['lyrics', artist, track],
    queryFn: async () => {
      const params = new URLSearchParams({ artist, track });
      const response = await fetch(`${BACKEND_URL}/lyrics?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
      }

      return response.json();
    },
    enabled: !!artist && !!track,
  });
};

export const useTokens = (tracks: TopTrack[]) => {
  const names = tracks.map(t => t.name).join(',');
  const artists = tracks.map(t => t.artist.name).join(',');

  return useQuery<LyricsResponse>({
    queryKey: ['tokens', tracks],
    queryFn: async () => {
      const params = new URLSearchParams({ names, artists });
      const response = await fetch(`${BACKEND_URL}/lyrics/tokens?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
      }

      return response.json();
    },
    enabled: !!tracks,
  });
};

export const useTopWords = (tracks: TopTrack[], limit = 20) => {
  const names = tracks.map(t => t.name).join(',');
  const artists = tracks.map(t => t.artist.name).join(',');
  const playcounts = tracks.map(t => t.playcount).join(',');

  return useQuery<TopWordsResponse>({
    queryKey: ['top-words', tracks, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ names, artists, playcounts, limit: limit.toString() });
      const response = await fetch(`${BACKEND_URL}/lyrics/top-words?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch top words');
      }

      return response.json();
    },
    enabled: tracks.length > 0,
  });
};

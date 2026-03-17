import { useQuery } from '@tanstack/react-query';
import type { ComplexityResult, TopWordsResponse } from '../types';
import type { SpotifyTimeRange, SpotifyTopArtistsResponse, SpotifyTopTracksResponse, SpotifyTrack } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const useSpotifyTopTracks = (
  getToken: () => Promise<string | null>,
  timeRange: SpotifyTimeRange,
  limit: number,
  options?: { enabled?: boolean },
) => {
  return useQuery<SpotifyTrack[]>({
    queryKey: ['spotify-top-tracks', timeRange, limit],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated with Spotify');
      const params = new URLSearchParams({ time_range: timeRange, limit: limit.toString() });
      const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch top tracks from Spotify');
      const data: SpotifyTopTracksResponse = await response.json();
      return data.items;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useSpotifyTopArtists = (
  getToken: () => Promise<string | null>,
  timeRange: SpotifyTimeRange,
  limit: number,
  options?: { enabled?: boolean },
) => {
  return useQuery<SpotifyTopArtistsResponse['items']>({
    queryKey: ['spotify-top-artists', timeRange, limit],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated with Spotify');
      const params = new URLSearchParams({ time_range: timeRange, limit: limit.toString() });
      const response = await fetch(`https://api.spotify.com/v1/me/top/artists?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch top artists from Spotify');
      const data: SpotifyTopArtistsResponse = await response.json();
      return data.items;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useSpotifyTopWords = (tracks: SpotifyTrack[], wordLimit = 20) => {
  const names = tracks.map(t => t.name).join(',');
  const artists = tracks.map(t => t.artists[0]?.name ?? '').join(',');
  // spotify wont show play count...
  const playcounts = tracks.map(() => '1').join(',');

  return useQuery<TopWordsResponse>({
    queryKey: ['spotify-top-words', tracks.map(t => t.id), wordLimit],
    queryFn: async () => {
      const params = new URLSearchParams({ names, artists, playcounts, limit: wordLimit.toString() });
      const response = await fetch(`${BACKEND_URL}/lyrics/top-words?${params}`);
      if (!response.ok) throw new Error('Failed to fetch top words');
      return response.json();
    },
    enabled: tracks.length > 0,
  });
};

export const useSpotifyComplexity = (tracks: SpotifyTrack[]) => {
  const names = tracks.map(t => t.name).join(',');
  const artists = tracks.map(t => t.artists[0]?.name ?? '').join(',');

  return useQuery<ComplexityResult[]>({
    queryKey: ['spotify-complexity', tracks.map(t => t.id)],
    queryFn: async () => {
      const params = new URLSearchParams({ names, artists });
      const response = await fetch(`${BACKEND_URL}/lyrics/complexity?${params}`);
      if (!response.ok) throw new Error('Failed to fetch complexity');
      const data = await response.json();
      return data.results;
    },
    enabled: tracks.length > 0,
  });
};

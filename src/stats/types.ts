export interface TopArtist {
    name: string;
    playcount: string;
    url: string;
    image: { '#text': string; size: string }[];
  }

export interface TopArtistsResponse {
    topartists: {
      artist: TopArtist[];
      '@attr': {
        user: string;
        totalPages: string;
        total: string;
      };
    };
  }

export type TimeFrame = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

export interface TopTrack {
  name: string;
  playcount: string;
  url: string;
  artist: {
    name: string;
    url: string;
  };
  image: { '#text': string; size: string }[];
}

export interface TopTracksResponse {
  toptracks: {
    track: TopTrack[];
    '@attr': {
      user: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface LyricsResponse {
  title: string;
  artist: string;
  lyrics: string;
  url: string;
}

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

export type Source = 'lastfm' | 'spotify';

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

export interface WordSource {
  title: string;
  artist: string;
}

export interface WordCount {
  word: string;
  count: number;
  sources?: WordSource[];
}

export interface TopWordsResponse {
  words: WordCount[];
  total_tokens: number;
}

export interface ComplexityResult {
  score: number;
  vocabulary_diversity: number;
  average_word_length: number;
  rare_word_ratio: number;
  total_words: number;
  unique_words: number;
  title: string;
  artist: string;
}

export const timeFrameOptions: { value: TimeFrame; label: string }[] = [
  { value: '7day', label: 'Last 7 Days' },
  { value: '1month', label: 'Last Month' },
  { value: '3month', label: 'Last 3 Months' },
  { value: '6month', label: 'Last 6 Months' },
  { value: '12month', label: 'Last Year' },
  { value: 'overall', label: 'All Time' },
];

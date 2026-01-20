export interface WordPressPost {
  id: number
  date: string
  title: string
  content: string
  excerpt: string
  featured_image: string
  rawContent: string
  slug: string;
}

export interface WordPressPostResponse {
  posts?: WordPressPost[];
}

import { useQuery } from '@tanstack/react-query';
import { decodeHtmlEntities } from './utils';
import type { WordPressPost } from './types';

const BLOG_API = import.meta.env.VITE_BLOG_API;

export const usePosts = (page: number) => {
  return useQuery<WordPressPost[] | undefined>({
    queryKey: ['get-reviews', page],
    queryFn: async () => {
      const response = await fetch(`${BLOG_API}/posts?page=${page}&limit=10`);
      const data = await response.json();

      const posts = data.posts.map((value: any) => {
        return {
          id: value.id,
          date: value.date,
          title: decodeHtmlEntities(value.title),
          content: decodeHtmlEntities(value.content),
          excerpt: decodeHtmlEntities(value.excerpt),
          featured_image: value.featured_image,
          rawContent: value.content,
          slug: value.slug,
        } as WordPressPost;
      });

      return posts ?? undefined;
    },
  });
};

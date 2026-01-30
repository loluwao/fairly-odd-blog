import { Stack, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import { useEffect, useMemo, useState } from 'react';

import { PageLayout } from '../components/PageLayout';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import theme from '../theme';

import { usePosts } from './queries';
import { formatDate } from './utils';
import type { WordPressPost } from './types';
import type { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';

// renders article headings
const ArticleHeading: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Typography color={theme.palette.color.neonPink} variant="h3">{children}</Typography>
  );
};

// renders article paragraphs
const ArticleParagraph: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Typography variant="body1" color={theme.palette.color.white}>
      {children}
    </Typography>
  );
};

// renders href links
const CustomLink: React.FC<{ href: string; children?: React.ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: theme.palette.color.softGreen,
        textDecoration: 'underline',
      }}
    >
      {children}
    </a>
  );
};

const LazyYouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => {
  return <YouTubeEmbed videoId={videoId} />;
};

// get yt ID from url
const extractYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  );

  return match ? match[1] : null;
};

// parse WordPress content into components. I will find a better way to do this
const parseWordPressContent = (content: string): React.ReactNode => {
  if (!content) return null;

  const sanitizeOptions = {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'em', 'strong', 'blockquote', 'br',
      'ul', 'ol', 'li', 'figure', 'iframe',
      'div', 'span', 'img',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'class',
      'style', 'allow', 'sandbox', 'allowfullscreen',
      'frameborder', 'width', 'height', 'alt', 'title',
    ],
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allowfullscreen', 'frameborder', 'sandbox'],
  };

  // first decode HTML entities
  const decodedContent = content.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(dec),
  );

  // transform yt embeds for lazy loading
  const transformedContent = decodedContent.replace(
    /<iframe[^>]*src="https:\/\/www\.youtube\.com[^"]*"([^>]*)>/g,
    (match) => {
      const srcMatch = match.match(/src="([^"]*)"/);

      if (srcMatch) {
        const videoId = extractYouTubeId(srcMatch[1]);

        if (videoId) {
          return `<div data-youtube-id="${videoId}" class="youtube-placeholder"></div>`;
        }
      }

      return match;
    },
  );

  const cleanContent = DOMPurify.sanitize(transformedContent, sanitizeOptions);

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && 'name' in domNode) {
        const element = domNode;

        if (element.name.match(/^h[1-6]$/)) {
          return (
            <ArticleHeading>
              {domToReact(element.children as DOMNode[], parserOptions)}
            </ArticleHeading>
          );
        }
        if (element.name === 'p') {
          return (
            <ArticleParagraph>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </ArticleParagraph>
          );
        }
        if (element.name === 'a' && element.attribs.href) {
          return (
            <CustomLink href={element.attribs.href}>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </CustomLink>
          );
        }
        if (element.name === 'ul') {
          return (
            <ul style={{
              color: theme.palette.color.white,
              paddingLeft: '2rem',
              marginBottom: '1rem',
            }}>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </ul>
          );
        }

        if (element.name === 'ol') {
          return (
            <ol style={{
              color: theme.palette.color.white,
              paddingLeft: '2rem',
              marginBottom: '1rem',
            }}>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </ol>
          );
        }
        if (element.name === 'li') {
          return (
            <li style={{ marginBottom: '0.5rem' }}>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </li>
          );
        }
        if (element.name === 'em') {
          return (
            <Typography fontStyle={'italic'}>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </Typography>
          );
        }
        if (element.name === 'strong') {
          return (
            <Typography fontStyle={'bold'}>
              {domToReact(element.children as DOMNode[], parserOptions) }
            </Typography>
          );
        }
        if (
          element.name === 'div' &&
          element.attribs.class === 'youtube-placeholder' &&
          element.attribs['data-youtube-id']
        ) {
          return <LazyYouTubeEmbed videoId={element.attribs['data-youtube-id']} />;
        }
        if (
          element.name === 'figure' &&
          element.attribs.class.includes('wp-block-embed-youtube')
        ) {
          const iframe = element.children.find(
            (child): child is Element =>
              (child as Element).type === 'tag' &&
              (child as Element).name === 'iframe',
          );

          if (iframe?.attribs.src) {
            const videoId = extractYouTubeId(iframe.attribs.src);

            if (videoId) {
              return <LazyYouTubeEmbed videoId={videoId} />;
            }
          }
        }
        if (element.name === 'iframe' && element.attribs.src) {
          const videoId = extractYouTubeId(element.attribs.src);

          if (videoId) {
            return <LazyYouTubeEmbed videoId={videoId} />;
          }

          return (
            <iframe
              src={element.attribs.src}
              title="Embedded content"
              allow={element.attribs.allow}
              sandbox={element.attribs.sandbox}
              style={{
                border: 'none',
                maxWidth: '100%',
                margin: '1rem 0',
              }}
            />
          );
        }
      }

      return undefined;
    },
  };

  return parse(cleanContent, parserOptions);
};

export const PostPage: React.FC = () => {
  const slug = useParams({ strict: false }).reviewSlug ?? '';
  const { data: posts } = usePosts(0);
  const [post, setPost] = useState<WordPressPost | null>(null);

  useEffect(() => {
    if (posts) {
      const foundPost = posts.find(p => p.slug === slug);

      setPost(foundPost || null);
    }
  }, [posts, slug]);

  const parsedContent = useMemo(() => {
    return post?.rawContent ? parseWordPressContent(post.rawContent) : null;
  }, [post]);

  return (
    <PageLayout
      header={ post?.title ?? ''}
      subheader={post ? formatDate(post.date) : undefined}
      content={
        <Stack spacing={2} sx={{ maxWidth: '800px', margin: '0 auto', padding: 2 }}>
          {parsedContent}
        </Stack>
      }
    />
  );
};

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import { ArticleCard } from './ArticleCard';

function renderCard(overrides: Partial<React.ComponentProps<typeof ArticleCard>> = {}) {
  const props = {
    header: 'Test Article',
    previewText: 'A short preview of the post.',
    imgSrc: 'https://example.com/image.jpg',
    onClick: vi.fn(),
    ...overrides,
  };
  render(
    <ThemeProvider theme={theme}>
      <ArticleCard {...props} />
    </ThemeProvider>,
  );
  return props;
}

describe('ArticleCard', () => {
  it('renders the article header', () => {
    renderCard();
    expect(screen.getByText('Test Article')).toBeDefined();
  });

  it('renders the preview text', () => {
    renderCard();
    expect(screen.getByText('A short preview of the post.')).toBeDefined();
  });

  it('renders the image with the correct src', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('example.com/image.jpg');
  });

  it('calls onClick when the card is clicked', () => {
    const onClick = vi.fn();
    renderCard({ onClick });
    fireEvent.click(screen.getByText('Test Article'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick before any interaction', () => {
    const onClick = vi.fn();
    renderCard({ onClick });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onClick when preview text is clicked (event bubbles)', () => {
    const onClick = vi.fn();
    renderCard({ onClick });
    fireEvent.click(screen.getByText('A short preview of the post.'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

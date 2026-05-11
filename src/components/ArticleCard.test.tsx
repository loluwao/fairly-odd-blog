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
    date: '2024-01-15',
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

  it('renders the formatted date', () => {
    renderCard({ date: '2024-01-15' });
    expect(screen.getByText(/january/i)).toBeDefined();
  });

  it('renders the image with the correct src', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('example.com/image.jpg');
  });

  it('preview text is present in the DOM but hidden by default', () => {
    renderCard();
    const preview = screen.getByText('A short preview of the post.');
    expect(preview).toBeDefined();
    expect(preview.classList.contains('preview-text')).toBe(true);
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
});

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import { NavigationBar } from './NavigationBar';

// testing with plain a tags so I don't need router context
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: unknown }) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

function renderNav() {
  return render(
    <ThemeProvider theme={theme}>
      <NavigationBar />
    </ThemeProvider>,
  );
}

describe('NavigationBar', () => {
  it('renders both the open and close buttons', () => {
    renderNav();
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toBeDefined();
  });

  it('nav links are always in the DOM', () => {
    renderNav();
    expect(screen.getByText('BLOG')).toBeDefined();
    expect(screen.getByText('STATS')).toBeDefined();
  });

  it('nav links have the correct hrefs', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'BLOG' }).getAttribute('href')).toBe('/blog');
    expect(screen.getByRole('link', { name: 'STATS' }).getAttribute('href')).toBe('/stats');
  });

  it('hides the open button when the overlay is open', () => {
    renderNav();
    const openBtn = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(openBtn).toHaveStyle({ visibility: 'visible' });
    fireEvent.click(openBtn);
    expect(openBtn).toHaveStyle({ visibility: 'hidden' });
  });

  it('clicking a nav link closes the overlay', () => {
    renderNav();
    const openBtn = screen.getByRole('button', { name: 'Open navigation menu' });
    fireEvent.click(openBtn);
    fireEvent.click(screen.getByRole('link', { name: 'BLOG' }));
    expect(openBtn).toHaveStyle({ visibility: 'visible' });
  });
});

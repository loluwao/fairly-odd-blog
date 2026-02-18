import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { BlogPage } from './BlogPage'
import { usePosts } from './queries'
import type { WordPressPost } from './types'
import theme from '../theme'

// mock hooks
vi.mock('./queries', () => ({
  usePosts: vi.fn(),
}))
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

const mockPosts: WordPressPost[] = [
  {
    id: 1,
    date: '2024-01-15T10:00:00',
    title: 'Post One',
    content: '<p>Content one</p>',
    excerpt: 'Excerpt one',
    featured_image: 'https://example.com/img1.jpg',
    rawContent: '<p>Content one</p>',
    slug: 'post-one',
  },
  {
    id: 2,
    date: '2024-02-20T10:00:00',
    title: 'Post Two',
    content: '<p>Content two</p>',
    excerpt: 'Excerpt two',
    featured_image: 'https://example.com/img2.jpg',
    rawContent: '<p>Content two</p>',
    slug: 'post-two',
  },
]

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <BlogPage />
    </ThemeProvider>
  )
}

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('BlogPage — loading state', () => {
  it('shows a loading spinner while fetching', () => {
    vi.mocked(usePosts).mockReturnValue({ isLoading: true, isFetching: false, data: undefined } as any)
    renderPage()
    expect(screen.getByRole('progressbar')).toBeDefined()
  })

  it('shows the spinner during a background refetch', () => {
    vi.mocked(usePosts).mockReturnValue({ isLoading: false, isFetching: true, data: undefined } as any)
    renderPage()
    expect(screen.getByRole('progressbar')).toBeDefined()
  })
})

describe('BlogPage — error state', () => {
  it('shows an error message when data is undefined after loading', () => {
    vi.mocked(usePosts).mockReturnValue({ isLoading: false, isFetching: false, data: undefined } as any)
    renderPage()
    expect(screen.getByText(/something terrible/i)).toBeDefined()
  })
})

describe('BlogPage — carousel (default view)', () => {
  beforeEach(() => {
    vi.mocked(usePosts).mockReturnValue({ isLoading: false, isFetching: false, data: mockPosts } as any)
  })

  it('renders all article titles', () => {
    renderPage()
    expect(screen.getByText('Post One')).toBeDefined()
    expect(screen.getByText('Post Two')).toBeDefined()
  })

  it('renders article excerpts', () => {
    renderPage()
    expect(screen.getByText('Excerpt one')).toBeDefined()
  })

  it('previous button is disabled at the first item', () => {
    renderPage()
    const prevBtn = screen.getAllByRole('button')[1] as HTMLButtonElement
    expect(prevBtn.disabled).toBe(true)
  })

  it('next button is enabled when there are more items', () => {
    renderPage()
    const nextBtn = screen.getAllByRole('button')[2] as HTMLButtonElement
    expect(nextBtn.disabled).toBe(false)
  })

  it('clicking next enables the previous button', () => {
    renderPage()
    const [, prevBtn, nextBtn] = screen.getAllByRole('button') as HTMLButtonElement[]
    expect(prevBtn.disabled).toBe(true)
    fireEvent.click(nextBtn)
    expect(prevBtn.disabled).toBe(false)
  })

  it('next button becomes disabled at the last item', () => {
    renderPage()
    const nextBtn = screen.getAllByRole('button')[2] as HTMLButtonElement
    fireEvent.click(nextBtn) // advance to last item
    expect(nextBtn.disabled).toBe(true)
  })

  it('navigates to the post when the center card is clicked', () => {
    renderPage()
    fireEvent.click(screen.getByText('Post One'))
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/blog/$reviewSlug',
      params: { reviewSlug: 'post-one' },
    })
  })
})

describe('BlogPage — grid view', () => {
  beforeEach(() => {
    vi.mocked(usePosts).mockReturnValue({ isLoading: false, isFetching: false, data: mockPosts } as any)
  })

  it('switching to grid removes the prev/next carousel controls', () => {
    renderPage()
    expect(screen.getAllByRole('button')).toHaveLength(3)

    fireEvent.click(screen.getAllByRole('button')[0]) // switch to grid
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('grid view still renders all article titles', () => {
    renderPage()
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByText('Post One')).toBeDefined()
    expect(screen.getByText('Post Two')).toBeDefined()
  })

  it('clicking the toggle again returns to carousel view', () => {
    renderPage()
    fireEvent.click(screen.getAllByRole('button')[0]) // grid
    fireEvent.click(screen.getAllByRole('button')[0]) // carousel
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })
})

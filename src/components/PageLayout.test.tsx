import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { PageLayout } from './PageLayout'
import theme from '../theme'

function renderLayout(props: React.ComponentProps<typeof PageLayout>) {
  render(
    <ThemeProvider theme={theme}>
      <PageLayout {...props} />
    </ThemeProvider>
  )
}

describe('PageLayout', () => {
  it('renders the header text', () => {
    renderLayout({ header: 'MY PAGE', content: <div /> })
    expect(screen.getByText('MY PAGE')).toBeDefined()
  })

  it('renders the subheader when provided', () => {
    renderLayout({ header: 'MY PAGE', subheader: 'A subtitle', content: <div /> })
    expect(screen.getByText('A subtitle')).toBeDefined()
  })

  it('does not render a subheader when omitted', () => {
    renderLayout({ header: 'MY PAGE', content: <div /> })
    expect(screen.queryByText('A subtitle')).toBeNull()
  })

  it('renders the content', () => {
    renderLayout({
      header: 'MY PAGE',
      content: <div data-testid="page-content">hello</div>,
    })
    expect(screen.getByTestId('page-content')).toBeDefined()
  })

  it('renders the footer with contact links', () => {
    renderLayout({ header: 'MY PAGE', content: <div /> })
    expect(screen.getByText('email')).toBeDefined()
    expect(screen.getByText('IG')).toBeDefined()
  })

  it('renders different headers independently', () => {
    renderLayout({ header: 'BLOG', content: <div /> })
    expect(screen.getByText('BLOG')).toBeDefined()
    expect(screen.queryByText('STATS')).toBeNull()
  })
})

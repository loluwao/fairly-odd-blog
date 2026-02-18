import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { NavigationBar } from './NavigationBar'
import theme from '../theme'

// testing with plain a tags so I don't need router context
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

function renderNav() {
  return render(
    <ThemeProvider theme={theme}>
      <NavigationBar />
    </ThemeProvider>
  )
}

describe('NavigationBar', () => {
  it('renders a menu button', () => {
    renderNav()
    // only the hamburger icon should be vsible before drawer's opened
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('nav links are not in the DOM before the drawer is opened', () => {
    renderNav()
    // MUI drawer doesn't mount its content until it's opened once
    expect(screen.queryByText('BLOG')).toBeNull()
    expect(screen.queryByText('STATS')).toBeNull()
  })

  it('opens the drawer and shows nav links when menu button is clicked', () => {
    renderNav()
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByText('BLOG')).toBeDefined()
    expect(screen.getByText('STATS')).toBeDefined()
  })

  it('nav links have the correct hrefs', () => {
    renderNav()
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByRole('link', { name: 'BLOG' }).getAttribute('href')).toBe('/blog')
    expect(screen.getByRole('link', { name: 'STATS' }).getAttribute('href')).toBe('/stats')
  })

  it('closes the drawer when the close button is clicked', () => {
    renderNav()
    fireEvent.click(screen.getAllByRole('button')[0]) // open

    const buttons = screen.getAllByRole('button')
    const closeBtn = buttons[buttons.length - 1]
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('link', { name: 'BLOG' })).toBeNull()
  })
})

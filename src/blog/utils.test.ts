import { describe, it, expect } from 'vitest'
import { decodeHtmlEntities, formatDate } from './utils'

describe('decodeHtmlEntities', () => {
  it('returns plain text unchanged', () => {
    expect(decodeHtmlEntities('no entities here')).toBe('no entities here')
  })

  it('returns an empty string when given an empty string', () => {
    expect(decodeHtmlEntities('')).toBe('')
  })

  it('decodes &amp; to &', () => {
    expect(decodeHtmlEntities('Rock &amp; Roll')).toBe('Rock & Roll')
  })

  it('decodes &#038; to &', () => {
    expect(decodeHtmlEntities('Rock &#038; Roll')).toBe('Rock & Roll')
  })

  it('decodes &lt; to <', () => {
    expect(decodeHtmlEntities('&lt;div&gt;')).toBe('<div>')
  })

  it('decodes &gt; to >', () => {
    expect(decodeHtmlEntities('hello&gt;world')).toBe('hello>world')
  })

  it('decodes &quot; to "', () => {
    expect(decodeHtmlEntities('say &quot;hello&quot;')).toBe('say "hello"')
  })

  it('decodes em dash &#8212;', () => {
    expect(decodeHtmlEntities('hello&#8212;world')).toBe('hello\u2014world')
  })

  it('handles multiple different entities in one string', () => {
    expect(decodeHtmlEntities('&amp; &lt; &gt;')).toBe('& < >')
  })

  it('handles a realistic WordPress title with entities', () => {
    const input = 'Top 10 Albums&#8212;A &amp; R Edition'
    expect(decodeHtmlEntities(input)).toBe('Top 10 Albums\u2014A & R Edition')
  })
})

describe('formatDate', () => {
  const exampleDate = '2024-06-15T12:00:00Z';
  const altExampleDate = '2024-12-01T12:00:00Z';
  it('contains the correct year and month', () => {
    const result = formatDate(exampleDate)
    expect(result).toContain('2024')
    expect(result).toContain('June')
  })

  it('includes an AM or PM indicator', () => {
    const result = formatDate(exampleDate)
    expect(result).toMatch(/AM|PM/i)
  })

  it('returns different strings for different dates', () => {
    const date1 = formatDate(exampleDate)
    const date2 = formatDate(altExampleDate)
    expect(date1).not.toBe(date2)
  })
})

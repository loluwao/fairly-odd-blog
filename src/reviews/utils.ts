export const decodeHtmlEntities = (text: string): string => {
  if (typeof window === 'undefined') {
    return text
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&#8216;/g, '‘')
      .replace(/&#8217;/g, '’')
      .replace(/&#8220;/g, '“')
      .replace(/&#8221;/g, '”')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#038;/g, '&');
  }
  
  // Browser - use DOMParser for comprehensive decoding
  const parser = new DOMParser();
  const decoded = parser.parseFromString(text, 'text/html').body.textContent;
  return decoded || text;
};

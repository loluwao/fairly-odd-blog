function base64urlEncode(buffer: Uint8Array): string {
  let binary = '';
  buffer.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64urlEncode(array);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(new Uint8Array(digest));
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export function buildSpotifyAuthUrl(clientId: string, redirectUri: string, challenge: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'user-top-read',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  return `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCodeForTokens(
  code: string,
  verifier: string,
  clientId: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    }),
  });
  if (!response.ok) throw new Error('Failed to exchange code for tokens');
  return response.json();
}

export async function refreshSpotifyToken(refreshToken: string, clientId: string): Promise<TokenResponse> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });
  if (!response.ok) throw new Error('Failed to refresh Spotify token');
  return response.json();
}

export function getSpotifyRedirectUri(): string {
  return `${window.location.origin}/stats/spotify/callback`;
}

const TOKEN_KEY = 'spotify_access_token';
const REFRESH_KEY = 'spotify_refresh_token';
const EXPIRES_KEY = 'spotify_expires_at';

export function storeTokens(data: TokenResponse): void {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(EXPIRES_KEY, String(Date.now() + data.expires_in * 1000));
  if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isTokenValid(): boolean {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(EXPIRES_KEY) ?? 0);
  return !!token && Date.now() < expiresAt - 60_000; // 1 min safety buffer
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

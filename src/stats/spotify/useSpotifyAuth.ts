import { useCallback, useState } from 'react';
import {
  buildSpotifyAuthUrl,
  clearTokens,
  generateCodeChallenge,
  generateCodeVerifier,
  getRefreshToken,
  getSpotifyRedirectUri,
  getStoredToken,
  isTokenValid,
  refreshSpotifyToken,
  storeTokens,
} from './auth';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

export function useSpotifyAuth() {
  const [, forceUpdate] = useState(0);
  const isAuthenticated = isTokenValid();

  const login = useCallback(async (returnPath: string) => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem('spotify_code_verifier', verifier);
    sessionStorage.setItem('spotify_return_path', returnPath);
    window.location.href = buildSpotifyAuthUrl(CLIENT_ID, getSpotifyRedirectUri(), challenge);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    forceUpdate(n => n + 1);
  }, []);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (isTokenValid()) return getStoredToken();
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    try {
      const data = await refreshSpotifyToken(refreshToken, CLIENT_ID);
      storeTokens(data);
      forceUpdate(n => n + 1);
      return data.access_token;
    } catch {
      clearTokens();
      forceUpdate(n => n + 1);
      return null;
    }
  }, []);

  return { isAuthenticated, login, logout, getValidToken };
}

import { CircularProgress, Stack, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { PageWrapper } from '../../../../components/PageWrapper';
import { exchangeCodeForTokens, getSpotifyRedirectUri, storeTokens } from '../../../../stats/spotify/auth';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

function SpotifyCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const errorParam = params.get('error');

    if (errorParam) {
      setError(`Spotify declined access: ${errorParam}`);
      return;
    }

    if (!code) {
      setError('No authorization code received from Spotify.');
      return;
    }

    const verifier = sessionStorage.getItem('spotify_code_verifier');
    const returnPath = sessionStorage.getItem('spotify_return_path') ?? '/stats';
    const redirectUri = getSpotifyRedirectUri();

    if (!verifier) {
      setError('Missing code verifier. Please try connecting again.');
      return;
    }

    exchangeCodeForTokens(code, verifier, CLIENT_ID, redirectUri)
      .then(data => {
        storeTokens(data);
        sessionStorage.removeItem('spotify_code_verifier');
        sessionStorage.removeItem('spotify_return_path');
        navigate({ to: returnPath });
      })
      .catch(err => setError(err.message));
  }, [navigate]);

  return (
    <Stack height="100dvh" alignItems="center" justifyContent="center" gap={2}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CircularProgress sx={{ color: '#1DB954' }} />
          <Typography color="white">Connecting to Spotify...</Typography>
        </>
      )}
    </Stack>
  );
}

export const Route = createFileRoute('/stats/spotify/callback/')({
  component: () => (
    <PageWrapper>
      <SpotifyCallback />
    </PageWrapper>
  ),
});

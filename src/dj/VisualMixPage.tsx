import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { PageLayout } from '../components/PageLayout';
import theme from '../theme';
import { TRACKS } from './tracks';

const FFT = 2048;
const C1 = theme.palette.color.neonPink;
const C2 = theme.palette.color.neonGreen;

function lerpColor(hex1: string, hex2: string, t: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

export const VisualMixPage: React.FC = () => {
  const id = useParams({ strict: false }).id;
  const track = TRACKS.find(t => t.id === id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animIdRef = useRef<number>(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const audioUrl = track?.url ?? `${import.meta.env.VITE_AUDIO_BUCKET}/${id}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.getContext('2d')?.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => () => { cancelAnimationFrame(animIdRef.current); }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const showOverlay = () => {
    setOverlayVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setOverlayVisible(false), 2500);
  };

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const audioCtx = audioCtxRef.current;

    if (!analyserRef.current) {
      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = FFT;
      analyserRef.current.smoothingTimeConstant = 0.82;
      analyserRef.current.connect(audioCtx.destination);
    }

    if (!sourceRef.current) {
      sourceRef.current = audioCtx.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
    }

    cancelAnimationFrame(animIdRef.current);

    const analyser = analyserRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);

    const frame = () => {
      animIdRef.current = requestAnimationFrame(frame);
      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, W, H);
      analyser.getByteFrequencyData(data);

      const bars = 128;
      const barW = (W / bars) * 0.8;
      const gap = (W / bars) * 0.2;
      for (let i = 0; i < bars; i++) {
        const t = i / (bars - 1);
        const color = lerpColor(C1, C2, t);
        const val = data[Math.floor(i * bufLen / bars)] / 255;
        const h = val * H * 0.9;
        const x = i * (barW + gap);
        const grad = ctx.createLinearGradient(0, H - h, 0, H);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color.replace('rgb(', 'rgba(').replace(')', ',0.15)'));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, H - h, barW, h, [3, 3, 0, 0]);
        ctx.fill();
      }
    };

    frame();
  };

  return (
    <PageLayout
      header={''}
      content={
        <Box sx={{ maxWidth: 800, my: 'auto' }}>
          <Box
            ref={containerRef}
            onMouseMove={isFullscreen ? showOverlay : undefined}
            sx={{
              position: 'relative',
              borderRadius: isFullscreen ? 0 : '12px',
              overflow: 'hidden',
              background: theme.palette.color.darkGray,
              ...(isFullscreen && { width: '100vw', height: '100vh' }),
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: isFullscreen ? '100%' : 320,
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isFullscreen ? (overlayVisible ? 1 : 0) : 1,
                transition: 'opacity 0.6s ease',
                pointerEvents: isFullscreen && !overlayVisible ? 'none' : 'auto',
              }}
            >
              <Box >
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  crossOrigin="anonymous"
                  onPlay={startVisualizer}
                  style={{ width: '100%' }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pb: 1 }}>
                <IconButton
                  onClick={toggleFullscreen}
                  size="small"
                  sx={{
                    color: theme.palette.color.neonGreen,
                  }}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Box>
            </Box>
          </Box>

          {!isFullscreen && track && (
            <Box sx={{ mt: 1 }} >
              <Typography variant='subtitle2'>
                {track.title}
              </Typography>
              {track.description && (
                <Typography variant='caption' sx={{ color: theme.palette.color.whiteAlpha50, mt: 0.25 }}>
                  {track.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      }
    />
  );
};

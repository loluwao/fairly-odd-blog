import { useEffect, useRef } from 'react';
import theme from '../theme';

// TODO: make this actually look cool
export const CoolCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate(calc(${e.clientX}px - 75px), calc(${e.clientY}px - 75px))`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div ref={cursorRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '150px',
      height: '150px',
      backgroundColor: theme.palette.color.silver,
      borderRadius: '50%',
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      zIndex: 1000,
      transform: 'translate(-100px, -100px)',
      transition: 'transform 0.08s ease-out',
      filter: 'blur(8px)',
    }} />
  );
};

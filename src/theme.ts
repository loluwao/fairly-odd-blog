import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    color: {
      darkGray: string
      darkGreen: string
      darkBlue: string
      silver: string
      neonGreen: string
      neonPink: string
      softGreen: string
      white: string
      whiteAlpha70: string
      whiteAlpha50: string
      blackAlpha85: string
      coral: string
      teal: string
      skyBlue: string
      sage: string
      butter: string
      plum: string
      mint: string
      gold: string
      lavender: string
      lightBlue: string
      amber: string
      salmon: string
      aqua: string
      yellow: string
      green: string
    }
  }
  interface PaletteOptions {
    color: {
      darkGray: string
      darkGreen: string
      darkBlue: string
      silver: string
      neonGreen: string
      neonPink: string
      softGreen: string
      white: string
      whiteAlpha70: string
      whiteAlpha50: string
      blackAlpha85: string
      coral: string
      teal: string
      skyBlue: string
      sage: string
      butter: string
      plum: string
      mint: string
      gold: string
      lavender: string
      lightBlue: string
      amber: string
      salmon: string
      aqua: string
      yellow: string
      green: string
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E1E1E',
    },
    secondary: {
      main: '#1E1E1E',
    },
    color: {
      darkGray: '#0a0a0a',
      darkGreen: '#3C7C32',
      darkBlue: '#32387C',
      silver: '#949494',
      neonGreen: '#48C78E',
      neonPink: '#DB4076',
      softGreen: '#a5f4acff',
      white: '#FFFFFF',
      whiteAlpha70: 'rgba(255,255,255,0.7)',
      whiteAlpha50: 'rgba(255,255,255,0.5)',
      blackAlpha85: 'rgba(0,0,0,0.85)',
      coral: '#FF6B6B',
      teal: '#4ECDC4',
      skyBlue: '#45B7D1',
      sage: '#96CEB4',
      butter: '#FFEAA7',
      plum: '#DDA0DD',
      mint: '#98D8C8',
      gold: '#F7DC6F',
      lavender: '#BB8FCE',
      lightBlue: '#85C1E9',
      amber: '#F8B500',
      salmon: '#FF8C94',
      aqua: '#91EAE4',
      yellow: '#FFD93D',
      green: '#6BCB77',
    },
  },
  typography: {
    // Primary font for headings and UI
    fontFamily: [
      '"Manrope"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),

    h1: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '4rem', // 48px
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.6,
      color: 'text.secondary',
    },
    subtitle2: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.6,
      color: 'text.secondary',
    },
    body1: {
      fontFamily: '"Lora", serif',
      fontSize: '1.125rem', // 16px
      fontWeight: 400,
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Lora", serif',
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.6,
    },
    caption: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.4,
      color: 'text.secondary',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '4px',
          transition: 'all 0.2s ease-in-out',
          letterSpacing: '0.02em',
        },
        contained: () => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.color.neonGreen,
          border: `1px solid ${theme.palette.color.neonGreen}`,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.color.neonPink,
            color: theme.palette.color.neonPink,
          },
          '&:disabled': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.color.silver,
            borderColor: theme.palette.color.silver,
            opacity: 0.5,
          },
        }),
        outlined: () => ({
          borderColor: theme.palette.color.neonGreen,
          color: theme.palette.color.neonGreen,
          '&:hover': {
            borderColor: theme.palette.color.neonPink,
            color: theme.palette.color.neonPink,
            backgroundColor: 'transparent',
          },
        }),
        text: () => ({
          color: theme.palette.color.white,
          '&:hover': {
            color: theme.palette.color.neonGreen,
            backgroundColor: 'transparent',
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: () => ({
          '& .MuiInputBase-input': { color: theme.palette.color.white },
          '& .MuiInputLabel-root': { color: theme.palette.color.whiteAlpha70 },
          '& .MuiInput-underline:before': { borderBottomColor: theme.palette.color.whiteAlpha50 },
          '& .MuiInput-underline:hover:before': { borderBottomColor: theme.palette.color.white },
          '& .MuiInput-underline:after': { borderBottomColor: theme.palette.color.white },
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: () => ({
          display: 'list-item',
          listStyleType: 'disc',
          '&::marker': {
            color: theme.palette.color.white,
          },
          '& > *': {
            display: 'inline',
            marginRight: 4,
          },
          color: theme.palette.color.white,
        }),
      },
    },
    MuiTypography: {
      defaultProps: {},
      styleOverrides: {
        root: () => ({
          color: theme.palette.color.white,
        }),
      },
    },
  },
});

export default theme;

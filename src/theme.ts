import { createTheme } from '@mui/material'

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
        style: {},
      },
    },
    MuiTypography: {
      defaultProps: {},
    },
  },
})

export default theme

import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#E5E5E5',
    },
    secondary: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#4B5563',
    },
    background: {
      default: 'linear-gradient(135deg, #0E0D11 0%, #1C1C1E 100%)',
      paper: '#1C1C1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
    },
    grey: {
      50: '#2C2C2E',
      100: '#3A3A3C',
      200: '#48484A',
      300: '#636366',
      400: '#8E8E93',
      500: '#AEAEB2',
      600: '#C7C7CC',
      700: '#D1D1D6',
      800: '#E5E5EA',
      900: '#F2F2F7',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: '#8E8E93',
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#8E8E93',
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#48484A',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#F2F2F7',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#3A3A3C',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#48484A',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: 'none',
          backgroundColor: '#1C1C1E',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1C1C1E',
        },
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 500,
          height: 'auto',
          padding: '6px 16px',
          backgroundColor: '#2C2C2E',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          '&:hover': {
            backgroundColor: '#3A3A3C',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#2C2C2E',
          color: '#FFFFFF',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#3A3A3C',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#2C2C2E',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFFFFF',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});

export default darkTheme;
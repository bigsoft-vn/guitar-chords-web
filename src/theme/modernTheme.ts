import { createTheme } from '@mui/material/styles';

export const modernTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      dark: '#4f46e5',
      light: '#8b5cf6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      dark: '#be185d',
      light: '#f472b6',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      paper: 'rgba(255, 255, 255, 0.25)',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
    '0 10px 20px -3px rgba(0, 0, 0, 0.1)',
    '0 12px 25px -5px rgba(0, 0, 0, 0.1)',
    '0 16px 30px -5px rgba(0, 0, 0, 0.1)',
    '0 20px 35px -5px rgba(0, 0, 0, 0.1)',
    '0 25px 40px -12px rgba(0, 0, 0, 0.25)',
    '0 8px 32px rgba(31, 38, 135, 0.37)',
    '0 20px 40px rgba(0, 0, 0, 0.1)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '12px 24px',
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'none',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(31, 38, 135, 0.5)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
        outlined: {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.18)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.18)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(31, 38, 135, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.75rem',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.25)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: '2px solid #ffffff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            },
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
          },
          '& .MuiSlider-rail': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
  },
});

// Custom CSS variables for additional styling
export const modernCSSVariables = {
  '--gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  '--gradient-secondary': 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  '--gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
  '--gradient-warm': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  '--glass-bg': 'rgba(255, 255, 255, 0.25)',
  '--glass-border': 'rgba(255, 255, 255, 0.18)',
  '--shadow-soft': '0 8px 32px rgba(31, 38, 135, 0.37)',
  '--shadow-hard': '0 20px 40px rgba(0, 0, 0, 0.1)',
  '--blur-strong': 'blur(20px)',
  '--blur-light': 'blur(10px)',
};
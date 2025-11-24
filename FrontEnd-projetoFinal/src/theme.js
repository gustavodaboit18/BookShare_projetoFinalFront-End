import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2d5a3d',
      light: '#4a7c5d',
      dark: '#1e3d29',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4c5a9', 
      light: '#e5d9c3',
      dark: '#b8a888',
      contrastText: '#2d5a3d',
    },
    background: {
      default: '#f5f5f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;

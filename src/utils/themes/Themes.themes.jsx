import { createTheme } from "@mui/material";

// Create MUI theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      dark: '#2E7D32',
      light: '#81C784',
    },
    secondary: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
    background: {
      default: '#f5f5f5',
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
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});
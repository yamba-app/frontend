import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './utils/themes/Themes.themes.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { AuthProvider } from './core/contexts/auth.context.jsx'

if (import.meta.env.VITE_APP_ENV === "production") {
  disableReactDevTools();
  console.warn = () => { };
  console.error = () => { };
}
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>,
)

import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { FaHeart } from 'react-icons/fa';

const MemoizedFooter = React.memo(() => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.800',
        color: 'white',
        py: 8,
        mt: 16,
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center">
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            VenteAffaires BF
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: 'grey.300',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            La plateforme burkinabè pour acheter et vendre des entreprises
          </Typography>
          
          <Box sx={{ color: 'grey.400', fontSize: '0.875rem' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              © 2025 VenteAffaires BF. Tous droits réservés.
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              Fait avec
              <FaHeart
                size={16}
                color={theme.palette.error.main}
                style={{
                  animation: 'heartbeat 2s ease-in-out infinite',
                }}
              />
              pour l'entrepreneuriat burkinabè
            </Typography>
          </Box>
        </Box>
      </Container>

      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </Box>
  );
});

MemoizedFooter.displayName = 'MemoizedFooter';

export default MemoizedFooter;
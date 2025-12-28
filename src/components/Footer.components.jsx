import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Grid,
  Link,
  Divider,
} from '@mui/material';
import { FaHeart } from 'react-icons/fa';
import { MdGavel, MdLock, MdWarning } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { pagesRoutes } from '../constants/routes.constans';

const MemoizedFooter = React.memo(() => {
  const theme = useTheme();
  
  const legalLinks = [
    {
      title: 'Conditions Générales',
      path: pagesRoutes.termeCondition,
      icon: <MdGavel size={18} />,
    },
    {
      title: 'Disclaimer Légal',
      path: pagesRoutes.disclaimer,
      icon: <MdWarning size={18} />,
    },
    {
      title: 'Politique de Confidentialité',
      path: pagesRoutes.privacy,
      icon: <MdLock size={18} />,
    },
  ];

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
        <Grid container spacing={4}>
          {/* Column 1 - Brand */}
          <Grid item xs={12} md={4}>
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
              variant="body2"
              sx={{
                color: 'grey.300',
                mb: 2,
              }}
            >
              La plateforme burkinabè de référence pour acheter et vendre des entreprises en toute sécurité.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'grey.400',
                mt: 2,
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
          </Grid>

          {/* Column 2 - Legal Links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: '1rem',
              }}
            >
              Informations légales
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'grey.300',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#28a745',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  {link.icon}
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Column 3 - Contact */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: '1rem',
              }}
            >
              Contact & Support
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'grey.300', mb: 1 }}>
              📧 services@yamba-dh.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300', mb: 1 }}>
              📞 +226  65402020
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              📍 Ouagadougou, Burkina Faso
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            © 2025 VenteAffaires BF. Tous droits réservés.
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            Conforme à la Loi 010 2021/AN - OHADA
          </Typography>
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
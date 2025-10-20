import React from 'react';
import { Backdrop, Box, Typography } from '@mui/material';

export const SuspenseSpinner = ({
  isLoading = true,
  appName = "Vente Business",
  title,
  subtitle,
  variant = "loading",
  showAppName = false,
  fullscreen = true,
  size = 80
}) => {
  const getConfig = () => {
    switch (variant) {
      case "page":
        return {
          title: title || "Chargement de la page",
          subtitle: subtitle || "Préparation de l'interface",
          primary: "#10b981",
          secondary: "#34d399",
          accent: "#6ee7b7",
        };
      case "component":
        return {
          title: title || "Chargement du composant",
          subtitle: subtitle || "Initialisation en cours",
          primary: "#3b82f6",
          secondary: "#60a5fa",
          accent: "#93c5fd",
        };
      case "auth":
        return {
          title: title || "Authentification",
          subtitle: subtitle || "Vérification des accès",
          primary: "#f59e0b",
          secondary: "#fbbf24",
          accent: "#fcd34d",
        };
      default:
        return {
          title: title || "Chargement",
          subtitle: subtitle || "Veuillez patienter",
          primary: "#8b5cf6",
          secondary: "#a78bfa",
          accent: "#c4b5fd",
        };
    }
  };

  const config = getConfig();

  const containerStyles = fullscreen ? {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%)',
    backdropFilter: 'blur(12px)',
    zIndex: 9999,
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    py: 6,
  };

  const SpinnerContent = () => (
    <Box sx={containerStyles}>
      <Box sx={{
        textAlign: 'center',
        position: 'relative',
        maxWidth: '400px',
        px: 3,
      }}>
        
        {/* App Name with Morphing Effect */}
        {showAppName && (
          <Box sx={{ mb: 5, overflow: 'hidden' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                letterSpacing: '-0.02em',
                background: fullscreen 
                  ? `linear-gradient(120deg, #ffffff 0%, ${config.primary} 50%, #ffffff 100%)`
                  : `linear-gradient(120deg, ${config.primary} 0%, ${config.secondary} 50%, ${config.accent} 100%)`,
                backgroundSize: '300% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 4s ease-in-out infinite',
                '@keyframes gradient-shift': {
                  '0%, 100%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' }
                }
              }}
            >
              {appName}
            </Typography>
          </Box>
        )}

        {/* Modern Spinner Design */}
        <Box sx={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          margin: '0 auto',
          mb: 4,
        }}>
          
          {/* Outer Orbit Ring */}
          <Box sx={{
            position: 'absolute',
            inset: -12,
            borderRadius: '50%',
            border: `2px solid transparent`,
            borderTopColor: fullscreen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            animation: 'orbit 3s linear infinite',
            '@keyframes orbit': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}>
            <Box sx={{
              position: 'absolute',
              top: -4,
              left: '50%',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: config.primary,
              boxShadow: `0 0 20px ${config.primary}`,
              transform: 'translateX(-50%)',
            }} />
          </Box>

          {/* Main Rotating Ring */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, transparent 0%, ${config.primary} 50%, ${config.secondary} 100%)`,
            animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            maskImage: 'radial-gradient(circle, transparent 65%, black 66%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 65%, black 66%)',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />

          {/* Inner Pulsing Core */}
          <Box sx={{
            position: 'absolute',
            inset: '25%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.primary}40 0%, transparent 70%)`,
            animation: 'pulse-core 2s ease-in-out infinite',
            '@keyframes pulse-core': {
              '0%, 100%': { 
                transform: 'scale(0.8)',
                opacity: 0.4 
              },
              '50%': { 
                transform: 'scale(1.2)',
                opacity: 0.8 
              }
            }
          }} />

          {/* Center Dot */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: fullscreen ? '#fff' : config.primary,
            transform: 'translate(-50%, -50%)',
            boxShadow: fullscreen 
              ? `0 0 30px rgba(255, 255, 255, 0.6)`
              : `0 0 30px ${config.primary}60`,
          }} />

          {/* Decorative Particles */}
          {[0, 120, 240].map((angle, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: config.accent,
                transformOrigin: `0 0`,
                transform: `rotate(${angle}deg) translateX(${size/2 + 16}px)`,
                animation: `particle-float 3s ease-in-out infinite ${i * 0.4}s`,
                '@keyframes particle-float': {
                  '0%, 100%': { opacity: 0.3, transform: `rotate(${angle}deg) translateX(${size/2 + 16}px) scale(0.8)` },
                  '50%': { opacity: 1, transform: `rotate(${angle}deg) translateX(${size/2 + 24}px) scale(1.5)` }
                }
              }}
            />
          ))}
        </Box>

        {/* Text Content */}
        <Box sx={{ 
          animation: 'fade-in 0.6s ease-out',
          '@keyframes fade-in': {
            'from': { opacity: 0, transform: 'translateY(10px)' },
            'to': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              mb: 1.5,
              color: fullscreen ? '#fff' : 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            {config.title}
          </Typography>

          {config.subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: fullscreen ? 'rgba(255, 255, 255, 0.65)' : 'text.secondary',
                fontSize: '0.875rem',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              {config.subtitle}
            </Typography>
          )}

          {/* Progress Dots */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1,
            alignItems: 'center',
          }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: fullscreen 
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))`
                    : `linear-gradient(135deg, ${config.primary}, ${config.secondary})`,
                  animation: 'dot-bounce 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.16}s`,
                  '@keyframes dot-bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0.6)',
                      opacity: 0.4
                    },
                    '40%': {
                      transform: 'scale(1.1)',
                      opacity: 1
                    }
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Bottom Gradient Line */}
        <Box sx={{
          position: 'absolute',
          bottom: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 2,
          background: fullscreen
            ? `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`
            : `linear-gradient(90deg, transparent, ${config.primary}40, transparent)`,
          animation: 'line-pulse 2s ease-in-out infinite',
          '@keyframes line-pulse': {
            '0%, 100%': { opacity: 0.3, transform: 'translateX(-50%) scaleX(0.8)' },
            '50%': { opacity: 1, transform: 'translateX(-50%) scaleX(1)' }
          }
        }} />
      </Box>
    </Box>
  );

  return fullscreen ? (
    <Backdrop
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'transparent'
      }}
      open={isLoading}
    >
      <SpinnerContent />
    </Backdrop>
  ) : (
    <SpinnerContent />
  );
};

// Specialized Variants
export const PageLoadingSpinner = (props) => (
  <SuspenseSpinner 
    {...props} 
    variant="page" 
    fullscreen={true}
    showAppName={true}
  />
);

export const ComponentLoadingSpinner = (props) => (
  <SuspenseSpinner 
    {...props} 
    variant="component" 
    fullscreen={false}
    size={60}
  />
);

export const AuthLoadingSpinner = (props) => (
  <SuspenseSpinner 
    {...props} 
    variant="auth" 
    fullscreen={true}
    showAppName={true}
  />
);

// Demo Component
const SpinnerDemo = () => {
  const [variant, setVariant] = React.useState('loading');
  const [fullscreen, setFullscreen] = React.useState(true);

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#0f172a' }}>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <button 
          onClick={() => setVariant('loading')}
          style={{
            padding: '8px 16px',
            background: variant === 'loading' ? '#8b5cf6' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Default
        </button>
        <button 
          onClick={() => setVariant('page')}
          style={{
            padding: '8px 16px',
            background: variant === 'page' ? '#10b981' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Page
        </button>
        <button 
          onClick={() => setVariant('component')}
          style={{
            padding: '8px 16px',
            background: variant === 'component' ? '#3b82f6' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Component
        </button>
        <button 
          onClick={() => setVariant('auth')}
          style={{
            padding: '8px 16px',
            background: variant === 'auth' ? '#f59e0b' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Auth
        </button>
        <button 
          onClick={() => setFullscreen(!fullscreen)}
          style={{
            padding: '8px 16px',
            background: '#1e293b',
            color: 'white',
            border: '1px solid #475569',
            borderRadius: '6px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          {fullscreen ? 'Show Inline' : 'Show Fullscreen'}
        </button>
      </Box>

      <SuspenseSpinner 
        variant={variant}
        fullscreen={fullscreen}
        showAppName={true}
      />
    </Box>
  );
};

export default SpinnerDemo;
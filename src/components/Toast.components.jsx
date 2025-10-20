import { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes,
  FaExclamationCircle 
} from 'react-icons/fa';

// Motion components
const MotionAlert = motion.create(Alert);

const useToast = () => {
  const theme = useTheme();
  const [toast, setToast] = useState({ 
    open: false, 
    title: '', 
    description: '', 
    severity: 'info' 
  });

  const showToast = useCallback(({ title, description, status = 'info' }) => {
    setToast({ open: true, title, description, severity: status });
  }, []);

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  // Custom icons for different severity types
  const getCustomIcon = (severity) => {
    const iconProps = { size: 20 };
    switch (severity) {
      case 'success':
        return <FaCheckCircle {...iconProps} />;
      case 'error':
        return <FaExclamationCircle {...iconProps} />;
      case 'warning':
        return <FaExclamationTriangle {...iconProps} />;
      case 'info':
      default:
        return <FaInfoCircle {...iconProps} />;
    }
  };

  // Custom colors based on severity
  const getAlertStyles = (severity) => {
    const baseStyles = {
      borderRadius: 3,
      border: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      backdropFilter: 'blur(20px)',
      minWidth: 350,
      maxWidth: 500,
      '& .MuiAlert-icon': {
        fontSize: 24,
        alignItems: 'center'
      },
      '& .MuiAlert-message': {
        flex: 1,
        padding: '4px 0'
      },
      '& .MuiAlert-action': {
        padding: '0 4px 0 16px',
        marginRight: 0
      }
    };

    switch (severity) {
      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          '& .MuiAlert-icon': { color: 'white' },
          '& .MuiAlertTitle-root': { color: 'white', fontWeight: 700 }
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(211, 47, 47, 0.95) 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          '& .MuiAlert-icon': { color: 'white' },
          '& .MuiAlertTitle-root': { color: 'white', fontWeight: 700 }
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(245, 124, 0, 0.95) 100%)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          '& .MuiAlert-icon': { color: 'white' },
          '& .MuiAlertTitle-root': { color: 'white', fontWeight: 700 }
        };
      case 'info':
      default:
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}f5 0%, ${theme.palette.primary.dark}f5 100%)`,
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          '& .MuiAlert-icon': { color: 'white' },
          '& .MuiAlertTitle-root': { color: 'white', fontWeight: 700 }
        };
    }
  };

  // Animation variants
  const slideVariants = {
    initial: {
      opacity: 0,
      x: 400,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      x: 400,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.085, 0.68, 0.53]
      }
    }
  };

  const ToastComponent = (
    <AnimatePresence mode="wait">
      {toast.open && (
        <Snackbar
          open={toast.open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbar-root': {
              top: 24
            }
          }}
        >
          <MotionAlert
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            severity={toast.severity}
            icon={getCustomIcon(toast.severity)}
            sx={getAlertStyles(toast.severity)}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <FaTimes size={16} />
              </IconButton>
            }
          >
            <Box>
              {toast.title && (
                <AlertTitle 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '1.1rem',
                    marginBottom: toast.description ? 1 : 0,
                    lineHeight: 1.2
                  }}
                >
                  {toast.title}
                </AlertTitle>
              )}
              {toast.description && (
                <Box
                  component="div"
                  sx={{
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    opacity: 0.95
                  }}
                >
                  {toast.description}
                </Box>
              )}
            </Box>
          </MotionAlert>
        </Snackbar>
      )}
    </AnimatePresence>
  );

  return { showToast, ToastComponent };
};

export default useToast;
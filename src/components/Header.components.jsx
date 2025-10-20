import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Drawer from "@mui/material/Drawer"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import Chip from "@mui/material/Chip"
import Fade from "@mui/material/Fade"
import Avatar from "@mui/material/Avatar"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import {
  FaBuilding,
  FaBars,
  FaTimes,
  FaPlus,
  FaUser,
  FaBell,
  FaSearch,
  FaTachometerAlt,
  FaStore,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaEnvelope,
  FaShieldAlt,
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
} from 'react-icons/fa';
import useCurrentUser from '../core/current/user.currents';
import { adminDrawerItems, avatarMenuItems, publicNavItems } from '../constants/items.constant';
import { useLogout } from '../core/logout/logout.logout';

export function Header({ children }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useCurrentUser();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [notificationCount] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const logout = useLogout();
  // Check if user is admin
  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  // Function to determine if a nav item is active
  const isNavItemActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
    setDesktopOpen(false);
  };

  const handleAvatarClick = (event) => {
    if (isAdmin) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item) => {
    handleMenuClose();

    if (item.action === 'logout') {
      logout();
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  // Admin Drawer Content
  const adminDrawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,215,0,0.3)',
                color: 'white',
                mr: 2,
                width: 48,
                height: 48,
                border: '2px solid rgba(255,215,0,0.5)',
                fontWeight: 'bold'
              }}
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                {currentUser?.name || 'Administrateur'}
              </Typography>
              <Chip
                label="ADMIN"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,215,0,0.9)',
                  color: '#1B5E20',
                  fontWeight: 'bold',
                  fontSize: '0.65rem',
                  height: 18,
                }}
              />
            </Box>
          </Box>

          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <FaTimes />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} />

      {/* Admin Info Section */}
      <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Panneau d'administration
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
          {currentUser?.email}
        </Typography>
      </Box>

      <Divider />

      {/* Admin Navigation Items */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            color: 'text.secondary', 
            fontWeight: 'bold',
            fontSize: '0.7rem',
            letterSpacing: 1
          }}
        >
          NAVIGATION
        </Typography>
        {adminDrawerItems.map((item, index) => {
          const isActive = isNavItemActive(item.path);
          return (
            <Fade key={item.id} in timeout={300 + (index * 100)}>
              <ListItem disablePadding sx={{ mb: 0.5, mt: 1 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'success.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'success.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      }
                    },
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateX(4px)',
                      transition: 'all 0.2s ease',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.color,
                      minWidth: 40,
                      '& svg': {
                        fontSize: '1.2rem'
                      }
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem'
                    }}
                  />
                  {isActive && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        ml: 1
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Fade>
          );
        })}
      </List>

      {/* Quick Action in Drawer */}
      <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => handleNavClick('/add-business')}
          sx={{
            bgcolor: 'success.main',
            color: 'white',
            fontWeight: 600,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': {
              bgcolor: 'success.dark',
              transform: 'translateY(-2px)',
              boxShadow: 6,
            },
            transition: 'all 0.3s ease'
          }}
        >
          Publier une entreprise
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: { xs: 64, sm: 72, md: 80 },
              px: { xs: 1, sm: 2 },
              justifyContent: 'space-between'
            }}
          >
            {/* Left Section - Logo & Menu Button */}
            <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
              {/* Menu Button (Admin only - both mobile and desktop) */}
              {isAdmin && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    mr: 2,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FaBars />
                </IconButton>
              )}

              <Box
                display="flex"
                alignItems="center"
                onClick={() => handleNavClick(isAdmin ? '/admin/dashboard' : '/')}
                sx={{ cursor: 'pointer' }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    mr: 2,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <FaBuilding size={isMobile ? 18 : 22} />
                </Avatar>
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2
                      }}
                    >
                      VenteAffaires BF
                    </Typography>
                    {isAdmin && !isMobile && (
                      <Chip
                        label="ADMIN"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,215,0,0.9)',
                          color: '#1B5E20',
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          height: 20,
                        }}
                      />
                    )}
                  </Box>
                  {!isMobile && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                      }}
                    >
                      MARKETPLACE D'ENTREPRISES
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Center Section - Public Navigation (Always visible) */}
            {!isMobile && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  p: 1,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {publicNavItems.map((item) => {
                  const isActive = isNavItemActive(item.path);
                  return (
                    <Button
                      key={item.id}
                      startIcon={item.icon}
                      onClick={() => handleNavClick(item.path)}
                      sx={{
                        color: 'white',
                        px: 3,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: { md: '0.9rem', lg: '0.95rem' },
                        bgcolor: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
                        backdropFilter: isActive ? 'blur(20px)' : 'none',
                        border: isActive ? '1px solid rgba(255,255,255,0.3)' : 'none',
                        minWidth: isTablet ? 'auto' : 120,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                        '& .MuiButton-startIcon': {
                          marginRight: isTablet ? 0.5 : 1,
                        }
                      }}
                    >
                      {isTablet ? '' : item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Right Section - Actions */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{ flex: { xs: 'none', md: 1 }, justifyContent: 'flex-end' }}
            >
              {isAdmin && !isMobile && (
                <>
                 
                  <IconButton
                    onClick={() => handleNavClick('/admin/messages')}
                    sx={{
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <FaEnvelope />
                    </Badge>
                  </IconButton>

                  <IconButton
                    onClick={() => handleNavClick('/admin/notifications')}
                    sx={{
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Badge badgeContent={notificationCount} color="error">
                      <FaBell />
                    </Badge>
                  </IconButton>
                </>
              )}

              {/* Avatar or Login Button */}
              {isAdmin ? (
                <Avatar
                  onClick={handleAvatarClick}
                  sx={{
                    bgcolor: 'rgba(255,215,0,0.3)',
                    color: 'white',
                    width: { xs: 40, sm: 44 },
                    height: { xs: 40, sm: 44 },
                    border: '2px solid rgba(255,215,0,0.5)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 20px rgba(255,215,0,0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
              ) : (
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Connexion
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Avatar Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 260,
              borderRadius: 3,
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ 
          px: 3, 
          py: 2.5, 
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          color: 'white'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,215,0,0.3)',
                color: 'white',
                width: 48,
                height: 48,
                border: '2px solid rgba(255,215,0,0.5)',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {currentUser?.name || 'Administrateur'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {currentUser?.email || 'admin@example.com'}
              </Typography>
              <Chip
                label="ADMIN"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,215,0,0.9)',
                  color: '#1B5E20',
                  fontWeight: 'bold',
                  fontSize: '0.65rem',
                  height: 18,
                  mt: 0.5
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        <Box sx={{ py: 1 }}>
          {avatarMenuItems.map((item, index) => {
            if (item.type === 'divider') {
              return <Divider key={index} sx={{ my: 1 }} />;
            }

            return (
              <MenuItem
                key={index}
                onClick={() => handleMenuItemClick(item)}
                sx={{
                  px: 3,
                  py: 1.5,
                  mx: 1,
                  borderRadius: 2,
                  color: item.action === 'logout' ? 'error.main' : 'text.primary',
                  '&:hover': {
                    bgcolor: item.action === 'logout' ? 'error.lighter' : 'grey.100',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.color,
                    minWidth: '40px !important'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontSize: '0.95rem',
                      fontWeight: item.action === 'logout' ? 600 : 500
                    }
                  }}
                />
              </MenuItem>
            );
          })}
        </Box>
      </Menu>

      {/* Admin Drawer - Works for both mobile and desktop */}
      {isAdmin && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={isMobile ? mobileOpen : desktopOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              border: 'none',
            },
          }}
        >
          {adminDrawer}
        </Drawer>
      )}

      {/* Spacer for fixed header */}
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72, md: 80 } }} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
        {children}
      </Box>
    </>
  );
}
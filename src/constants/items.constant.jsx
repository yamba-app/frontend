import {  FaBuilding, FaHome, FaInfoCircle, FaPhone, FaPhoneAlt, FaSignOutAlt, FaTachometerAlt, FaUserCircle, FaUsers } from "react-icons/fa";

// Main navigation items (navbar) - Public items
  export const publicNavItems = [
    {
      id: 'home',
      label: 'Accueil',
      path: '/',
      icon: <FaHome />,
    },
    {
      id: 'about',
      label: 'À propos',
      path: '/about',
      icon: <FaInfoCircle />,
    },
    {
      id: 'contact',
      label: 'Contact',
      path: '/contact',
      icon: <FaPhoneAlt />,
    },
  ];

  // Admin drawer navigation items
 export const adminDrawerItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: <FaTachometerAlt />,
      color: 'primary.main'
    },
    {
      id: 'businesses',
      label: 'Gestion Entreprises',
      path: '/admin/businesses',
      icon: <FaBuilding />,
      color: 'success.main'
    },
  ];

  // Avatar menu items for admin
  export const avatarMenuItems = [
    {
      icon: <FaUserCircle />,
      label: 'Mon Profil',
      path: '/admin/profiles',
      color: 'primary.main'
    },
    {
      type: 'divider'
    },
    {
      icon: <FaSignOutAlt />,
      label: 'Déconnexion',
      action: 'logout',
      color: 'error.main'
    },
  ];

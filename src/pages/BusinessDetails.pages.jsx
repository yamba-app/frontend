// BusinessDetailPage.jsx
// UPDATED: Only displays public-safe data according to backend BusinessResource

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Chip,
    Divider,
    IconButton,
    Breadcrumbs,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Fade,
    Slide,
    Zoom
} from '@mui/material';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaInfoCircle,
    FaShare,
    FaHeart,
    FaHeartBroken,
    FaCheck,
    FaTag,
    FaChartLine,
    FaUsers,
    FaBuilding,
    FaDollarSign,
    FaIndustry,
    FaCheckCircle,
    FaStar,
    FaEnvelope
} from 'react-icons/fa';
import { useBusinessBySlug } from './services/homes.services';
import { useSendMessage } from '../features/services/Messages.services';
import useToast from '../components/Toast.components';
import { InquiryDialog } from './services/DialogContact.services';

export function BusinessDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showInquiryDialog, setShowInquiryDialog] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { showToast, ToastComponent } = useToast();
   
    // Fetch data with React Query
    const { data: business, isLoading, isError } = useBusinessBySlug(id);
    
    // Initialize the mutation hook
    const sendMessageMutation = useSendMessage({
        onSuccess: (result) => {
            showToast({
                title: "Succès",
                description: result.message || "Votre message a été envoyé avec succès!",
                status: "success"
            });
            setShowInquiryDialog(false);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 
                "Une erreur est survenue lors de l'envoi du message.";
            showToast({
                title: "Erreur",
                description: errorMessage,
                status: "error"
            });
        }
    });

    // Handle inquiry submission
    const handleInquirySubmit = async (payload) => {
        try {
            await sendMessageMutation.mutateAsync(payload);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    };

    // Combine photos and videos into a single media array
    const allMedia = React.useMemo(() => {
        if (!business) return [];

        const photos = (business.photos || []).map(url => ({
            type: 'photo',
            url: url
        }));

        const videos = (business.videos || []).map(url => ({
            type: 'video',
            url: url
        }));

        return [...photos, ...videos];
    }, [business]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Loading state
    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Fade in={true} timeout={800}>
                    <Box textAlign="center" py={10}>
                        <CircularProgress size={70} thickness={4} sx={{ color: 'success.main' }} />
                        <Typography variant="h5" sx={{ mt: 3, fontWeight: 500, color: 'text.secondary' }}>
                            Chargement des détails...
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        );
    }

    // Error or not found state
    if (isError || !business) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Fade in={true} timeout={800}>
                    <Box textAlign="center" py={10}>
                        <Typography variant="h4" color="error" gutterBottom sx={{ fontWeight: 600 }}>
                            Entreprise non trouvée
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Cette entreprise n'existe pas ou a été supprimée.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            startIcon={<FaArrowLeft />}
                            size="large"
                            sx={{
                                bgcolor: 'success.main',
                                '&:hover': { bgcolor: 'success.dark' },
                                px: 4,
                                py: 1.5
                            }}
                        >
                            Retour à l'accueil
                        </Button>
                    </Box>
                </Fade>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Breadcrumbs - NO BUSINESS NAME (protected) */}
            <Fade in={true} timeout={600}>
                <Breadcrumbs 
                    sx={{ 
                        mb: 3,
                        '& .MuiBreadcrumbs-separator': {
                            color: 'success.main'
                        }
                    }}
                >
                    <Link
                        color="inherit"
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                        sx={{ 
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': {
                                color: 'success.main',
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Accueil
                    </Link>
                    <Typography color="success.main" sx={{ fontWeight: 600 }}>
                        {business.category}
                    </Typography>
                    <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                        Réf: {business.businessNumber}
                    </Typography>
                </Breadcrumbs>
            </Fade>

            {/* Hero Header Section - NO BUSINESS NAME */}
            <Slide direction="down" in={true} timeout={800}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        mb: 4, 
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={2}>
                        <Box flex={1}>
                            {/* Title - Show Category instead of name for privacy */}
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 800,
                                    color: 'text.primary',
                                    mb: 2,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                }}
                            >
                                Entreprise à vendre
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
                                <Chip
                                    icon={<FaMapMarkerAlt />}
                                    label={business.location}
                                    variant="outlined"
                                    color="success"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        px: 1
                                    }}
                                />
                                <Chip
                                    icon={<FaTag />}
                                    label={business.category}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        px: 1
                                    }}
                                />
                                <Chip
                                    icon={<FaBuilding />}
                                    label={`Réf: ${business.businessNumber}`}
                                    variant="filled"
                                    sx={{ 
                                        bgcolor: 'success.light',
                                        color: 'success.dark',
                                        fontWeight: 700,
                                        fontSize: '0.9rem'
                                    }}
                                />
                                {/* Verified Badge */}
                                {business.verified && (
                                    <Chip
                                        icon={<FaCheckCircle />}
                                        label="Vérifié"
                                        variant="filled"
                                        sx={{ 
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                )}
                            </Box>

                            <Box 
                                sx={{ 
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                    color: 'white',
                                    px: 4,
                                    py: 2,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                                    mb: 2
                                }}
                            >
                                <Typography variant="caption" sx={{ display: 'block', opacity: 0.9, fontWeight: 600, mb: 0.5 }}>
                                    PRIX DEMANDÉ
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FaDollarSign size={28} />
                                    {formatPrice(business.price)}
                                </Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaCalendarAlt />
                                Publié le {new Date(business.createdAt || business.datePosted).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </Typography>
                        </Box>

                        <Box display="flex" gap={1.5}>
                            <Zoom in={true} timeout={1000}>
                                <IconButton
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    sx={{ 
                                        bgcolor: isFavorite ? 'error.light' : 'background.paper',
                                        boxShadow: 2,
                                        color: isFavorite ? 'error.main' : 'text.secondary',
                                        '&:hover': {
                                            bgcolor: 'error.light',
                                            color: 'error.main',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isFavorite ? <FaHeart size={24} /> : <FaHeartBroken size={24} />}
                                </IconButton>
                            </Zoom>
                            <Zoom in={true} timeout={1200}>
                                <IconButton
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: `Entreprise à vendre - ${business.businessNumber}`,
                                                text: business.description,
                                                url: window.location.href
                                            }).catch(() => {});
                                        }
                                    }}
                                    sx={{ 
                                        bgcolor: 'background.paper',
                                        boxShadow: 2,
                                        color: 'text.secondary',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.main',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <FaShare size={24} />
                                </IconButton>
                            </Zoom>
                        </Box>
                    </Box>
                </Paper>
            </Slide>

            <Grid container spacing={4}>
                {/* Left Column - Media and Description */}
                <Grid size={{md:8,sm:12,xs:12}}>
                    {/* Media Gallery */}
                    {allMedia.length > 0 && (
                        <Fade in={true} timeout={1000}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    mb: 4, 
                                    overflow: 'hidden',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                {/* Main Media Display */}
                                <Box sx={{ position: 'relative', height: { xs: 300, sm: 400, md: 500 }, bgcolor: 'black' }}>
                                    {allMedia[currentMediaIndex]?.type === 'video' ? (
                                        <video
                                            src={allMedia[currentMediaIndex].url}
                                            controls
                                            autoPlay={false}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                backgroundColor: '#000'
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            component="img"
                                            src={allMedia[currentMediaIndex]?.url}
                                            alt={`Entreprise ${business.businessNumber}`}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />
                                    )}

                                    {/* Media Type Indicator */}
                                    <Chip
                                        label={allMedia[currentMediaIndex]?.type === 'video' ? 'Vidéo' : 'Photo'}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            right: 20,
                                            bgcolor: allMedia[currentMediaIndex]?.type === 'video' ? 'rgba(211, 47, 47, 0.95)' : 'rgba(25, 118, 210, 0.95)',
                                            color: 'white',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    />

                                    {/* Media Counter */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            left: 20,
                                            bgcolor: 'rgba(0,0,0,0.85)',
                                            color: 'white',
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {currentMediaIndex + 1} / {allMedia.length}
                                    </Box>
                                </Box>

                                {/* Thumbnails */}
                                {allMedia.length > 1 && (
                                    <Box
                                        display="flex"
                                        gap={1.5}
                                        p={3}
                                        sx={{
                                            overflowX: 'auto',
                                            bgcolor: 'grey.50',
                                            '&::-webkit-scrollbar': {
                                                height: 8,
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: 4,
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#2e7d32',
                                                borderRadius: 4,
                                                '&:hover': {
                                                    backgroundColor: '#1b5e20',
                                                },
                                            },
                                        }}
                                    >
                                        {allMedia.map((media, index) => (
                                            <Box
                                                key={index}
                                                onClick={() => setCurrentMediaIndex(index)}
                                                sx={{
                                                    position: 'relative',
                                                    minWidth: 100,
                                                    height: 75,
                                                    cursor: 'pointer',
                                                    border: currentMediaIndex === index ? 3 : 2,
                                                    borderColor: currentMediaIndex === index ? 'success.main' : 'grey.400',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    boxShadow: currentMediaIndex === index ? 3 : 1,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        borderColor: 'success.main',
                                                        transform: 'scale(1.08)',
                                                        boxShadow: 3
                                                    }
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={media.url}
                                                    alt={`Media ${index + 1}`}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                {/* Video Play Icon Overlay */}
                                                {media.type === 'video' && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: 'rgba(0,0,0,0.5)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: '50%',
                                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: 2
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: 'black',
                                                                    fontSize: '14px',
                                                                    lineHeight: 1,
                                                                    marginLeft: '3px',
                                                                    fontWeight: 700
                                                                }}
                                                            >
                                                                ▶
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {/* Media Type Summary */}
                                <Box sx={{ px: 3, pb: 3, bgcolor: 'grey.50' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        📸 {business.photos?.length || 0} photo{(business.photos?.length || 0) !== 1 ? 's' : ''}
                                        {business.videos?.length > 0 &&
                                            ` • 🎥 ${business.videos.length} vidéo${business.videos.length !== 1 ? 's' : ''}`
                                        }
                                    </Typography>
                                </Box>
                            </Paper>
                        </Fade>
                    )}

                    {/* Description - PUBLIC FIELD */}
                    <Fade in={true} timeout={1200}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 700,
                                    color: 'success.dark',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <FaInfoCircle />
                                Description de l'entreprise
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography 
                                variant="body1" 
                                paragraph 
                                sx={{ 
                                    lineHeight: 2,
                                    fontSize: '1.05rem',
                                    color: 'text.primary',
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {business.description}
                            </Typography>
                        </Paper>
                    </Fade>

                    {/* Business Details - PUBLIC FIELDS ONLY */}
                    <Fade in={true} timeout={1400}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 4,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 700,
                                    color: 'success.dark',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <FaIndustry />
                                Détails de l'entreprise
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <FaTag color="#2e7d32" size={22} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Catégorie"
                                        secondary={business.category}
                                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                        secondaryTypographyProps={{ fontSize: '1rem', color: 'text.secondary' }}
                                    />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <FaMapMarkerAlt color="#2e7d32" size={22} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Localisation"
                                        secondary={business.location}
                                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                        secondaryTypographyProps={{ fontSize: '1rem', color: 'text.secondary' }}
                                    />
                                </ListItem>

                                {business.yearEstablished && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <FaCalendarAlt color="#2e7d32" size={22} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Année de création"
                                            secondary={business.yearEstablished}
                                            primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                            secondaryTypographyProps={{ fontSize: '1rem', color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                )}

                                {business.employees && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <FaUsers color="#2e7d32" size={22} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Nombre d'employés"
                                            secondary={`${business.employees} employés`}
                                            primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                            secondaryTypographyProps={{ fontSize: '1rem', color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                )}

                                {business.monthlyRevenue && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <FaChartLine color="#2e7d32" size={22} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Revenu mensuel estimé"
                                            secondary={formatPrice(business.monthlyRevenue)}
                                            primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                            secondaryTypographyProps={{ fontSize: '1rem', color: 'success.dark', fontWeight: 700 }}
                                        />
                                    </ListItem>
                                )}

                                {business.yearlyRevenue && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <FaChartLine color="#2e7d32" size={22} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Revenu annuel estimé"
                                            secondary={formatPrice(business.yearlyRevenue)}
                                            primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                                            secondaryTypographyProps={{ fontSize: '1rem', color: 'success.dark', fontWeight: 700 }}
                                        />
                                    </ListItem>
                                )}
                            </List>

                            {/* Assets/Advantages if available */}
                            {(business.assets?.length > 0 || business.advantages?.length > 0) && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    
                                    {business.assets?.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'success.dark' }}>
                                                Actifs inclus
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {business.assets.map((asset, index) => (
                                                    <Chip
                                                        key={index}
                                                        icon={<FaCheck />}
                                                        label={asset}
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {business.advantages?.length > 0 && (
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'success.dark' }}>
                                                Avantages
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {business.advantages.map((advantage, index) => (
                                                    <Chip
                                                        key={index}
                                                        icon={<FaStar />}
                                                        label={advantage}
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Paper>
                    </Fade>
                </Grid>

                {/* Right Column - Contact Card */}
                <Grid size={{md:4,sm:12,xs:12}}>
                    <Fade in={true} timeout={1600}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4,
                                position: 'sticky',
                                top: 20,
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: 'success.light',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 700,
                                    color: 'success.dark',
                                    mb: 3,
                                    textAlign: 'center'
                                }}
                            >
                                Intéressé par cette entreprise?
                            </Typography>
                            
                            <Box sx={{ mb: 3, textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 1 }}>
                                    {formatPrice(business.price)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Prix demandé
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.8, mb: 2 }}>
                                    Pour obtenir plus d'informations sur cette entreprise, veuillez nous contacter.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.8, fontStyle: 'italic' }}>
                                    Les informations de contact du propriétaire seront partagées après vérification.
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<FaEnvelope />}
                                onClick={() => setShowInquiryDialog(true)}
                                sx={{
                                    py: 1.8,
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                    boxShadow: '0 4px 20px rgba(46, 125, 50, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                                        boxShadow: '0 6px 24px rgba(46, 125, 50, 0.5)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Demander des informations
                            </Button>

                            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, border: '1px solid', borderColor: 'info.main' }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.dark', display: 'block', mb: 1 }}>
                                    ℹ️ Informations protégées
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    Pour protéger la confidentialité du vendeur, certaines informations ne sont pas affichées publiquement.
                                </Typography>
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>
            </Grid>

            {/* Inquiry Dialog */}
            <InquiryDialog
                open={showInquiryDialog}
                onClose={() => setShowInquiryDialog(false)}
                business={business}
                onSubmit={handleInquirySubmit}
                isSubmitting={sendMessageMutation.isPending}
            />

            {/* Toast Notification */}
            {ToastComponent}
        </Container>
    );
}
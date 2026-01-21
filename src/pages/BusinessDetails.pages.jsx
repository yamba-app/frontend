// BusinessDetailPage.jsx
// REFINED: Enhanced UI/UX with better sold business handling and improved visual design

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
    Zoom,
    Alert,
    Card,
    CardContent,
    Stack,
    Tooltip
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
    FaEnvelope,
    FaBan,
    FaExclamationTriangle,
    FaShieldAlt,
    FaHistory,
    FaListAlt,
    FaTrophy,
    FaMoneyBillWave,
    FaHandshake,
    FaSearchPlus
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
    // eslint-disable-next-line no-unused-vars
    const [imageZoom, setImageZoom] = useState(false);
    const { showToast, ToastComponent } = useToast();
   
    const { data: business, isLoading, isError } = useBusinessBySlug(id);
    
    const isSold = business?.status === 'bought';
    
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

    const handleInquirySubmit = async (payload) => {
        try {
            await sendMessageMutation.mutateAsync(payload);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calculate business age
    const businessAge = business?.yearEstablished 
        ? new Date().getFullYear() - business.yearEstablished 
        : null;

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Fade in={true} timeout={800}>
                    <Box textAlign="center" py={10}>
                        <CircularProgress size={70} thickness={4} sx={{ color: 'success.main' }} />
                        <Typography variant="h5" sx={{ mt: 3, fontWeight: 500, color: 'text.secondary' }}>
                            Chargement des détails de l'entreprise...
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        );
    }

    if (isError || !business) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Fade in={true} timeout={800}>
                    <Box textAlign="center" py={10}>
                        <Box 
                            sx={{ 
                                width: 120, 
                                height: 120, 
                                mx: 'auto', 
                                mb: 3,
                                borderRadius: '50%',
                                bgcolor: 'error.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FaExclamationTriangle size={60} color="#d32f2f" />
                        </Box>
                        <Typography variant="h4" color="error" gutterBottom sx={{ fontWeight: 700 }}>
                            Entreprise introuvable
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                            Cette entreprise n'existe pas, a été supprimée ou n'est pas encore approuvée pour publication.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            startIcon={<FaArrowLeft />}
                            size="large"
                            sx={{
                                background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                px: 5,
                                py: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                                    boxShadow: '0 6px 28px rgba(46, 125, 50, 0.4)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
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
            {/* Sold Business Alert */}
            {isSold && (
                <Fade in={true} timeout={400}>
                    <Alert 
                        severity="error" 
                        icon={<FaExclamationTriangle size={24} />}
                        sx={{ 
                            mb: 4, 
                            fontWeight: 600,
                            fontSize: '1.05rem',
                            py: 2,
                            borderRadius: 2,
                            boxShadow: '0 4px 16px rgba(211, 47, 47, 0.2)',
                            '& .MuiAlert-message': {
                                width: '100%'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                                    Entreprise vendue
                                </Typography>
                                <Typography variant="body2">
                                    Cette entreprise a été vendue et n'est plus disponible à l'achat. Les informations sont affichées à titre informatif uniquement.
                                </Typography>
                            </Box>
                            <Chip 
                                icon={<FaBan />}
                                label="VENDU" 
                                color="error" 
                                sx={{ 
                                    fontWeight: 900,
                                    fontSize: '1rem',
                                    letterSpacing: '1.5px',
                                    px: 2,
                                    py: 2.5
                                }} 
                            />
                        </Box>
                    </Alert>
                </Fade>
            )}

            {/* Breadcrumbs */}
            <Fade in={true} timeout={600}>
                <Breadcrumbs 
                    sx={{ 
                        mb: 3,
                        '& .MuiBreadcrumbs-separator': {
                            color: isSold ? 'grey.600' : 'success.main',
                            mx: 1
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: isSold ? 'grey.700' : 'success.main',
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Accueil
                    </Link>
                    <Typography 
                        color={isSold ? "grey.700" : "success.main"} 
                        sx={{ 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <FaTag size={14} />
                        {business.category}
                    </Typography>
                    <Typography 
                        color="text.primary" 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <FaBuilding size={14} />
                        Réf: {business.businessNumber}
                    </Typography>
                </Breadcrumbs>
            </Fade>

            {/* Hero Header Section */}
            <Slide direction="down" in={true} timeout={800}>
                <Paper 
                    elevation={4} 
                    sx={{ 
                        mb: 4, 
                        p: { xs: 3, sm: 4, md: 5 },
                        background: isSold 
                            ? 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)',
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: isSold ? 'grey.300' : 'success.light',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Background Pattern */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: isSold 
                                ? 'radial-gradient(circle, rgba(158,158,158,0.1) 0%, rgba(158,158,158,0) 70%)'
                                : 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, rgba(46,125,50,0) 70%)',
                            pointerEvents: 'none'
                        }}
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="start" flexWrap="wrap" gap={3} position="relative" zIndex={1}>
                        <Box flex={1} minWidth={{ xs: '100%', md: '60%' }}>
                            {/* Status Badge */}
                            <Box sx={{ mb: 2 }}>
                                {isSold ? (
                                    <Chip
                                        icon={<FaBan />}
                                        label="ENTREPRISE VENDUE"
                                        color="error"
                                        sx={{ 
                                            fontWeight: 900,
                                            fontSize: '1rem',
                                            letterSpacing: '1px',
                                            px: 2,
                                            py: 2.5,
                                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
                                        }}
                                    />
                                ) : (
                                    <Chip
                                        icon={<FaHandshake />}
                                        label="DISPONIBLE À LA VENTE"
                                        color="success"
                                        sx={{ 
                                            fontWeight: 900,
                                            fontSize: '1rem',
                                            letterSpacing: '1px',
                                            px: 2,
                                            py: 2.5,
                                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Title */}
                            <Typography 
                                variant="h2" 
                                component="h1" 
                                gutterBottom 
                                sx={{ 
                                    fontWeight: 900,
                                    color: isSold ? 'grey.800' : 'text.primary',
                                    mb: 3,
                                    fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                                    lineHeight: 1.2,
                                    background: isSold 
                                        ? 'linear-gradient(135deg, #757575 0%, #424242 100%)'
                                        : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                {isSold ? 'Entreprise Vendue' : 'Opportunité d\'Affaires'}
                            </Typography>
                            
                            {/* Info Chips */}
                            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
                                <Chip
                                    icon={<FaMapMarkerAlt />}
                                    label={business.location}
                                    variant="filled"
                                    color={isSold ? "default" : "success"}
                                    sx={{ 
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        px: 2,
                                        py: 2.5,
                                        boxShadow: 1
                                    }}
                                />
                                <Chip
                                    icon={<FaTag />}
                                    label={business.category}
                                    variant="filled"
                                    color={isSold ? "default" : "primary"}
                                    sx={{ 
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        px: 2,
                                        py: 2.5,
                                        boxShadow: 1
                                    }}
                                />
                                <Chip
                                    icon={<FaBuilding />}
                                    label={`Réf: ${business.businessNumber}`}
                                    variant="outlined"
                                    sx={{ 
                                        bgcolor: 'background.paper',
                                        borderWidth: 2,
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        px: 2,
                                        py: 2.5,
                                        boxShadow: 1
                                    }}
                                />
                                {business.verified && !isSold && (
                                    <Chip
                                        icon={<FaCheckCircle />}
                                        label="Vérifié par Admin"
                                        variant="filled"
                                        sx={{ 
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            fontWeight: 800,
                                            fontSize: '1rem',
                                            px: 2,
                                            py: 2.5,
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* Price Display */}
                            <Card 
                                elevation={isSold ? 2 : 6}
                                sx={{ 
                                    display: 'inline-block',
                                    background: isSold 
                                        ? 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)'
                                        : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    border: '3px solid',
                                    borderColor: 'white',
                                    boxShadow: isSold 
                                        ? '0 6px 24px rgba(158, 158, 158, 0.4)'
                                        : '0 8px 32px rgba(46, 125, 50, 0.5)',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {/* Decorative Corner */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        pointerEvents: 'none'
                                    }}
                                />

                                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FaDollarSign size={24} />
                                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.95 }}>
                                            {isSold ? 'Prix de vente final' : 'Prix demandé'}
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant="h3" 
                                        sx={{ 
                                            fontWeight: 900,
                                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                            textDecoration: isSold ? 'line-through' : 'none',
                                            letterSpacing: '-1px'
                                        }}
                                    >
                                        {formatPrice(business.price)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Publication Date */}
                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaCalendarAlt size={18} color={isSold ? '#757575' : '#2e7d32'} />
                                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Publié le {formatDate(business.createdAt)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box display="flex" gap={2} alignItems="start">
                            <Tooltip title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
                                <Zoom in={true} timeout={1000}>
                                    <IconButton
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        sx={{ 
                                            bgcolor: isFavorite ? 'error.main' : 'background.paper',
                                            width: 56,
                                            height: 56,
                                            boxShadow: 3,
                                            color: isFavorite ? 'white' : 'text.secondary',
                                            '&:hover': {
                                                bgcolor: 'error.main',
                                                color: 'white',
                                                transform: 'scale(1.15) rotate(10deg)',
                                                boxShadow: 6
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        {isFavorite ? <FaHeart size={26} /> : <FaHeartBroken size={26} />}
                                    </IconButton>
                                </Zoom>
                            </Tooltip>
                            <Tooltip title="Partager">
                                <Zoom in={true} timeout={1200}>
                                    <IconButton
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: `Entreprise ${isSold ? 'vendue' : 'à vendre'} - ${business.businessNumber}`,
                                                    text: business.description,
                                                    url: window.location.href
                                                }).catch(() => {});
                                            }
                                        }}
                                        sx={{ 
                                            bgcolor: 'background.paper',
                                            width: 56,
                                            height: 56,
                                            boxShadow: 3,
                                            color: 'text.secondary',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                transform: 'scale(1.15)',
                                                boxShadow: 6
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        <FaShare size={24} />
                                    </IconButton>
                                </Zoom>
                            </Tooltip>
                        </Box>
                    </Box>
                </Paper>
            </Slide>

            <Grid container spacing={4}>
                {/* Left Column - Media and Details */}
                <Grid size={{md:8,sm:12,xs:12}}>
                    {/* Media Gallery */}
                    {allMedia.length > 0 && (
                        <Fade in={true} timeout={1000}>
                            <Paper 
                                elevation={4} 
                                sx={{ 
                                    mb: 4, 
                                    overflow: 'hidden',
                                    borderRadius: 3,
                                    border: '2px solid',
                                    borderColor: isSold ? 'grey.300' : 'success.light'
                                }}
                            >
                                <Box sx={{ position: 'relative', height: { xs: 350, sm: 450, md: 550 }, bgcolor: '#000' }}>
                                    {/* Main Media Display */}
                                    {allMedia[currentMediaIndex]?.type === 'video' ? (
                                        <video
                                            src={allMedia[currentMediaIndex].url}
                                            controls
                                            autoPlay={false}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                backgroundColor: '#000',
                                                filter: isSold ? 'grayscale(40%) brightness(0.8)' : 'none'
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
                                                cursor: 'zoom-in',
                                                transition: 'filter 0.3s ease',
                                                filter: isSold ? 'grayscale(40%) brightness(0.8)' : 'none',
                                                '&:hover': {
                                                    filter: isSold ? 'grayscale(30%) brightness(0.85)' : 'brightness(1.05)'
                                                }
                                            }}
                                            onClick={() => setImageZoom(true)}
                                        />
                                    )}

                                    {/* VENDU Watermark */}
                                    {isSold && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%) rotate(-20deg)',
                                                bgcolor: 'rgba(211, 47, 47, 0.92)',
                                                color: 'white',
                                                px: { xs: 6, sm: 10 },
                                                py: { xs: 2.5, sm: 4 },
                                                borderRadius: 3,
                                                fontSize: { xs: '2.5rem', sm: '4rem', md: '5rem' },
                                                fontWeight: 900,
                                                letterSpacing: { xs: '6px', sm: '12px' },
                                                border: '8px solid white',
                                                boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                                                pointerEvents: 'none',
                                                zIndex: 2,
                                                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            VENDU
                                        </Box>
                                    )}

                                    {/* Media Type Badge */}
                                    <Chip
                                        label={allMedia[currentMediaIndex]?.type === 'video' ? '🎥 Vidéo' : '📸 Photo'}
                                        size="medium"
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            right: 20,
                                            zIndex: 3,
                                            bgcolor: allMedia[currentMediaIndex]?.type === 'video' 
                                                ? 'rgba(211, 47, 47, 0.95)' 
                                                : 'rgba(25, 118, 210, 0.95)',
                                            color: 'white',
                                            fontWeight: 800,
                                            fontSize: '0.95rem',
                                            backdropFilter: 'blur(12px)',
                                            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            px: 2,
                                            py: 2.5
                                        }}
                                    />

                                    {/* Zoom Icon */}
                                    {allMedia[currentMediaIndex]?.type === 'photo' && (
                                        <Tooltip title="Cliquer pour agrandir">
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 20,
                                                    left: 20,
                                                    zIndex: 3,
                                                    bgcolor: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    width: 48,
                                                    height: 48,
                                                    backdropFilter: 'blur(8px)',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0,0,0,0.85)',
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}
                                                onClick={() => setImageZoom(true)}
                                            >
                                                <FaSearchPlus size={20} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {/* Media Counter */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 24,
                                            left: 24,
                                            bgcolor: 'rgba(0,0,0,0.88)',
                                            color: 'white',
                                            px: 3.5,
                                            py: 1.8,
                                            borderRadius: 2.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 800,
                                            backdropFilter: 'blur(12px)',
                                            border: '2px solid rgba(255,255,255,0.15)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                                            zIndex: 1
                                        }}
                                    >
                                        {currentMediaIndex + 1} / {allMedia.length}
                                    </Box>
                                </Box>

                                {/* Thumbnails */}
                                {allMedia.length > 1 && (
                                    <Box
                                        display="flex"
                                        gap={2}
                                        p={3}
                                        sx={{
                                            overflowX: 'auto',
                                            bgcolor: 'grey.100',
                                            borderTop: '2px solid',
                                            borderColor: isSold ? 'grey.300' : 'success.light',
                                            '&::-webkit-scrollbar': {
                                                height: 10,
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: 5,
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: isSold ? '#9e9e9e' : '#2e7d32',
                                                borderRadius: 5,
                                                '&:hover': {
                                                    backgroundColor: isSold ? '#757575' : '#1b5e20',
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
                                                    minWidth: 120,
                                                    height: 90,
                                                    cursor: 'pointer',
                                                    border: currentMediaIndex === index ? 4 : 2,
                                                    borderColor: currentMediaIndex === index 
                                                        ? (isSold ? 'grey.700' : 'success.dark') 
                                                        : 'grey.400',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    boxShadow: currentMediaIndex === index ? 4 : 2,
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        borderColor: isSold ? 'grey.700' : 'success.dark',
                                                        transform: 'scale(1.1) translateY(-4px)',
                                                        boxShadow: 6,
                                                        zIndex: 10
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
                                                        objectFit: 'cover',
                                                        filter: isSold ? 'grayscale(40%)' : 'none'
                                                    }}
                                                />
                                                {/* Active Indicator */}
                                                {currentMediaIndex === index && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 6,
                                                            right: 6,
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            bgcolor: isSold ? 'grey.700' : 'success.main',
                                                            border: '2px solid white',
                                                            boxShadow: 2
                                                        }}
                                                    />
                                                )}
                                                {/* Video Play Icon */}
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
                                                            bgcolor: 'rgba(0,0,0,0.4)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: 3
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: '#d32f2f',
                                                                    fontSize: '16px',
                                                                    lineHeight: 1,
                                                                    marginLeft: '3px',
                                                                    fontWeight: 900
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

                                {/* Media Summary */}
                                <Box sx={{ px: 3, py: 2, bgcolor: 'grey.100', borderTop: '1px solid', borderColor: 'grey.300' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        📸 {business.photos?.length || 0} photo{(business.photos?.length || 0) !== 1 ? 's' : ''}
                                        {business.videos?.length > 0 &&
                                            <> • 🎥 {business.videos.length} vidéo{business.videos.length !== 1 ? 's' : ''}</>
                                        }
                                    </Typography>
                                </Box>
                            </Paper>
                        </Fade>
                    )}

                    {/* Description Section */}
                    <Fade in={true} timeout={1200}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4, 
                                mb: 4,
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: isSold ? 'grey.300' : 'success.light',
                                background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: isSold 
                                            ? 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)'
                                            : 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 2
                                    }}
                                >
                                    <FaInfoCircle size={24} color="white" />
                                </Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800,
                                        color: isSold ? 'grey.800' : 'success.dark'
                                    }}
                                >
                                    Description
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3, borderWidth: 1 }} />
                            <Typography 
                                variant="body1" 
                                paragraph 
                                sx={{ 
                                    lineHeight: 2.2,
                                    fontSize: '1.1rem',
                                    color: 'text.primary',
                                    whiteSpace: 'pre-wrap',
                                    textAlign: 'justify'
                                }}
                            >
                                {business.description}
                            </Typography>
                        </Paper>
                    </Fade>

                    {/* Business Details Section */}
                    <Fade in={true} timeout={1400}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 4,
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: isSold ? 'grey.300' : 'success.light',
                                background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: isSold 
                                            ? 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)'
                                            : 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 2
                                    }}
                                >
                                    <FaIndustry size={24} color="white" />
                                </Box>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800,
                                        color: isSold ? 'grey.800' : 'success.dark'
                                    }}
                                >
                                    Détails de l'entreprise
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3, borderWidth: 1 }} />
                            
                            <List sx={{ '& .MuiListItem-root': { py: 2 } }}>
                                <ListItem 
                                    sx={{ 
                                        bgcolor: 'grey.50', 
                                        borderRadius: 2, 
                                        mb: 1.5,
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <ListItemIcon>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 1.5,
                                                bgcolor: isSold ? 'grey.300' : 'success.light',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FaTag color={isSold ? "#757575" : "#2e7d32"} size={20} />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Catégorie"
                                        secondary={business.category}
                                        primaryTypographyProps={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
                                        secondaryTypographyProps={{ fontSize: '1.1rem', color: 'text.secondary', fontWeight: 600, mt: 0.5 }}
                                    />
                                </ListItem>

                                <ListItem 
                                    sx={{ 
                                        bgcolor: 'grey.50', 
                                        borderRadius: 2, 
                                        mb: 1.5,
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <ListItemIcon>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 1.5,
                                                bgcolor: isSold ? 'grey.300' : 'success.light',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FaMapMarkerAlt color={isSold ? "#757575" : "#2e7d32"} size={20} />
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Localisation"
                                        secondary={business.location}
                                        primaryTypographyProps={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
                                        secondaryTypographyProps={{ fontSize: '1.1rem', color: 'text.secondary', fontWeight: 600, mt: 0.5 }}
                                    />
                                </ListItem>

                                {business.yearEstablished && (
                                    <ListItem 
                                        sx={{ 
                                            bgcolor: 'grey.50', 
                                            borderRadius: 2, 
                                            mb: 1.5,
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    bgcolor: isSold ? 'grey.300' : 'success.light',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <FaHistory color={isSold ? "#757575" : "#2e7d32"} size={20} />
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Année de création"
                                            secondary={`${business.yearEstablished}${businessAge ? ` (${businessAge} ans d'activité)` : ''}`}
                                            primaryTypographyProps={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
                                            secondaryTypographyProps={{ fontSize: '1.1rem', color: 'text.secondary', fontWeight: 600, mt: 0.5 }}
                                        />
                                    </ListItem>
                                )}

                                {business.employees && (
                                    <ListItem 
                                        sx={{ 
                                            bgcolor: 'grey.50', 
                                            borderRadius: 2, 
                                            mb: 1.5,
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    bgcolor: isSold ? 'grey.300' : 'success.light',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <FaUsers color={isSold ? "#757575" : "#2e7d32"} size={20} />
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Effectif"
                                            secondary={`${business.employees} employé${business.employees > 1 ? 's' : ''}`}
                                            primaryTypographyProps={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
                                            secondaryTypographyProps={{ fontSize: '1.1rem', color: 'text.secondary', fontWeight: 600, mt: 0.5 }}
                                        />
                                    </ListItem>
                                )}

                                {business.monthlyRevenue && (
                                    <ListItem 
                                        sx={{ 
                                            bgcolor: isSold ? 'grey.50' : 'success.50', 
                                            borderRadius: 2, 
                                            mb: 1.5,
                                            border: '2px solid',
                                            borderColor: isSold ? 'grey.300' : 'success.light'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    bgcolor: isSold ? 'grey.400' : 'success.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <FaMoneyBillWave color="white" size={20} />
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Revenu mensuel estimé"
                                            secondary={formatPrice(business.monthlyRevenue)}
                                            primaryTypographyProps={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
                                            secondaryTypographyProps={{ fontSize: '1.2rem', color: isSold ? 'text.secondary' : 'success.dark', fontWeight: 800, mt: 0.5 }}
                                        />
                                    </ListItem>
                                )}

                                {business.yearlyRevenue && (
                                    <ListItem 
                                        sx={{ 
                                            bgcolor: isSold ? 'grey.50' : 'success.50', 
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: isSold ? 'grey.300' : 'success.light'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    bgcolor: isSold ? 'grey.400' : 'success.dark',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <FaChartLine color="white" size={20} />
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Revenu annuel estimé"
                                            secondary={formatPrice(business.yearlyRevenue)}
                                            primaryTypographyProps={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
                                            secondaryTypographyProps={{ fontSize: '1.2rem', color: isSold ? 'text.secondary' : 'success.dark', fontWeight: 800, mt: 0.5 }}
                                        />
                                    </ListItem>
                                )}
                            </List>

                            {/* Assets & Advantages */}
                            {(business.assets?.length > 0 || business.advantages?.length > 0) && (
                                <>
                                    <Divider sx={{ my: 4, borderWidth: 1 }} />
                                    
                                    {business.assets?.length > 0 && (
                                        <Box sx={{ mb: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                                <FaListAlt size={24} color={isSold ? "#757575" : "#2e7d32"} />
                                                <Typography variant="h5" sx={{ fontWeight: 800, color: isSold ? 'grey.800' : 'success.dark' }}>
                                                    Actifs inclus
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                                {business.assets.map((asset, index) => (
                                                    <Chip
                                                        key={index}
                                                        icon={<FaCheck />}
                                                        label={asset}
                                                        color={isSold ? "default" : "success"}
                                                        variant="filled"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            py: 2.5,
                                                            px: 2,
                                                            boxShadow: 1
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {business.advantages?.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                                <FaTrophy size={24} color={isSold ? "#757575" : "#1976d2"} />
                                                <Typography variant="h5" sx={{ fontWeight: 800, color: isSold ? 'grey.800' : 'primary.dark' }}>
                                                    Avantages
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                                {business.advantages.map((advantage, index) => (
                                                    <Chip
                                                        key={index}
                                                        icon={<FaStar />}
                                                        label={advantage}
                                                        color={isSold ? "default" : "primary"}
                                                        variant="filled"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: '0.95rem',
                                                            py: 2.5,
                                                            px: 2,
                                                            boxShadow: 1
                                                        }}
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

                {/* Right Column - Contact/Action Card */}
                <Grid size={{md:4,sm:12,xs:12}}>
                    <Fade in={true} timeout={1600}>
                        <Paper 
                            elevation={4} 
                            sx={{ 
                                p: 4,
                                position: 'sticky',
                                top: 20,
                                borderRadius: 3,
                                border: '3px solid',
                                borderColor: isSold ? 'grey.400' : 'success.main',
                                background: isSold 
                                    ? 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)'
                                    : 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
                                boxShadow: isSold 
                                    ? '0 8px 32px rgba(158, 158, 158, 0.3)'
                                    : '0 12px 40px rgba(46, 125, 50, 0.3)'
                            }}
                        >
                            {/* Card Header */}
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        background: isSold 
                                            ? 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)'
                                            : 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        boxShadow: 3
                                    }}
                                >
                                    {isSold ? <FaBan size={40} color="white" /> : <FaHandshake size={40} color="white" />}
                                </Box>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 800,
                                        color: isSold ? 'grey.800' : 'success.dark',
                                        mb: 1
                                    }}
                                >
                                    {isSold ? 'Entreprise Vendue' : 'Intéressé?'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {isSold 
                                        ? 'Cette opportunité n\'est plus disponible'
                                        : 'Contactez-nous pour en savoir plus'
                                    }
                                </Typography>
                            </Box>
                            
                            {/* Price Display */}
                            <Card 
                                elevation={2}
                                sx={{ 
                                    mb: 3,
                                    background: isSold 
                                        ? 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)'
                                        : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                                    color: 'white',
                                    borderRadius: 2,
                                    border: '2px solid white',
                                    boxShadow: 3
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.9, display: 'block', mb: 1 }}>
                                        {isSold ? 'PRIX DE VENTE' : 'PRIX DEMANDÉ'}
                                    </Typography>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 900,
                                            textDecoration: isSold ? 'line-through' : 'none',
                                            textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {formatPrice(business.price)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Divider sx={{ my: 3, borderWidth: 1 }} />

                            {/* Content Based on Status */}
                            {isSold ? (
                                <>
                                    <Alert 
                                        severity="error" 
                                        icon={<FaBan />} 
                                        sx={{ 
                                            mb: 3,
                                            fontWeight: 600,
                                            '& .MuiAlert-message': {
                                                width: '100%'
                                            }
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            Plus disponible
                                        </Typography>
                                        <Typography variant="caption">
                                            Cette entreprise a été vendue avec succès.
                                        </Typography>
                                    </Alert>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 2, mb: 3, px: 1 }}>
                                        Découvrez notre sélection d'autres opportunités d'affaires actuellement disponibles sur notre plateforme.
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        startIcon={<FaArrowLeft />}
                                        onClick={() => navigate('/')}
                                        sx={{
                                            py: 2,
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                                            boxShadow: '0 6px 24px rgba(158, 158, 158, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #757575 0%, #616161 100%)',
                                                boxShadow: '0 8px 32px rgba(158, 158, 158, 0.5)',
                                                transform: 'translateY(-3px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Explorer d'autres entreprises
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Box sx={{ mb: 3, px: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 2, mb: 2 }}>
                                            Pour obtenir des informations détaillées sur cette opportunité d'affaires, contactez-nous dès maintenant.
                                        </Typography>
                                        <Alert severity="info" icon={<FaShieldAlt />} sx={{ fontSize: '0.85rem' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                🔒 Informations protégées
                                            </Typography>
                                            <Typography variant="caption" sx={{ lineHeight: 1.6 }}>
                                                Pour protéger la confidentialité, certaines informations ne sont partagées qu'après vérification.
                                            </Typography>
                                        </Alert>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        startIcon={<FaEnvelope />}
                                        onClick={() => setShowInquiryDialog(true)}
                                        sx={{
                                            py: 2,
                                            fontWeight: 800,
                                            fontSize: '1.1rem',
                                            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
                                            boxShadow: '0 8px 32px rgba(46, 125, 50, 0.5)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0d3c14 0%, #1b5e20 50%, #2e7d32 100%)',
                                                boxShadow: '0 12px 40px rgba(46, 125, 50, 0.6)',
                                                transform: 'translateY(-3px)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Demander des informations
                                    </Button>
                                </>
                            )}
                        </Paper>
                    </Fade>
                </Grid>
            </Grid>

            {/* Inquiry Dialog - Only if not sold */}
            {!isSold && (
                <InquiryDialog
                    open={showInquiryDialog}
                    onClose={() => setShowInquiryDialog(false)}
                    business={business}
                    onSubmit={handleInquirySubmit}
                    isSubmitting={sendMessageMutation.isPending}
                />
            )}

            {ToastComponent}
        </Container>
    );
}
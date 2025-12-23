// src/components/BusinessCard.jsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import {
    MdLocationOn as MapPinIcon,
    MdCalendarToday as CalendarIcon,
    MdInfo as InfoIcon,
    MdVisibility as EyeIcon,
    MdFavorite as HeartIcon,
    MdShare as ShareIcon,
    MdCategory as CategoryIcon,
    MdBusiness as BusinessIcon,
    MdPeople as PeopleIcon,
    MdTrendingUp as TrendingUpIcon,
    MdImage as ImageIcon,
    MdVideocam as VideoIcon,
    MdStorefront as StorefrontIcon
} from 'react-icons/md';
import { useSendMessage } from '../features/services/Messages.services';
import useToast from './Toast.components';
import { InquiryDialog } from '../pages/services/DialogContact.services';

export function BusinessCard({ business, onClick }) {
    const [showInquiryDialog, setShowInquiryDialog] = useState(false);
    const { showToast, ToastComponent } = useToast();

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

    const handleCardClick = () => {
        if (onClick) {
            onClick(business.slug || business.id);
        }
    };

    const handleActionClick = (e) => {
        e.stopPropagation();
    };

    const handleInquirySubmit = async (payload) => {
        try {
            await sendMessageMutation.mutateAsync(payload);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    };

    const formatPrice = (price) => {
        if (typeof price === 'string') return price;
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const truncateText = (text, maxLength = 120) => {
        if (!text || text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get the first available image (conditional - only if images exist)
    const firstImage = business.photos && business.photos.length > 0 ? business.photos[0] : null;
    const hasPhotos = business.photos?.length > 0;
    const hasVideos = business.videos?.length > 0;
    const hasMedia = hasPhotos || hasVideos;

    return (
        <>
            <Card
                elevation={2}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&:hover': {
                        elevation: 8,
                        transform: onClick ? 'translateY(-8px)' : 'translateY(-4px)',
                        boxShadow: '0 20px 48px rgba(46, 125, 50, 0.28)',
                    },
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
                }}
                onClick={handleCardClick}
            >
                {/* Top Accent Bar */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 50%, #2e7d32 100%)',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                    }}
                />

                {/* Conditional Image Section - Only renders if image exists */}
                {firstImage ? (
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                            component="img"
                            height="220"
                            image={firstImage}
                            alt={business.name}
                            sx={{
                                objectFit: 'cover',
                                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'scale(1.08)'
                                }
                            }}
                        />
                        
                        {/* Gradient Overlay for better text readability */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%)',
                                pointerEvents: 'none'
                            }}
                        />
                        
                        {/* Media Count Badges */}
                        {hasMedia && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 12,
                                    right: 12,
                                    display: 'flex',
                                    gap: 1,
                                    zIndex: 1
                                }}
                            >
                                {hasPhotos && (
                                    <Chip
                                        icon={<ImageIcon style={{ fontSize: 16, color: 'white' }} />}
                                        label={business.photos.length}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(0, 0, 0, 0.75)',
                                            color: 'white',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                            '& .MuiChip-icon': {
                                                color: 'white'
                                            }
                                        }}
                                    />
                                )}
                                {hasVideos && (
                                    <Chip
                                        icon={<VideoIcon style={{ fontSize: 16, color: 'white' }} />}
                                        label={business.videos.length}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(211, 47, 47, 0.9)',
                                            color: 'white',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.4)',
                                            '& .MuiChip-icon': {
                                                color: 'white'
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        )}

                        {/* Price Overlay on Image */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.97) 0%, rgba(56, 142, 60, 0.95) 100%)',
                                color: 'white',
                                px: 2.5,
                                py: 1.5,
                                borderRadius: 2,
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 16px rgba(46, 125, 50, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                zIndex: 1
                            }}
                        >
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: 700, 
                                    fontSize: '0.65rem', 
                                    display: 'block', 
                                    opacity: 0.95,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Prix demandé
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 800, 
                                    lineHeight: 1.2,
                                    fontSize: '1.25rem',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}
                            >
                                {formatPrice(business.price)}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    /* No Image Placeholder - Beautiful fallback design */
                    <Box
                        sx={{
                            height: 220,
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            borderBottom: '1px solid',
                            borderColor: 'success.light'
                        }}
                    >
                        {/* Decorative Pattern */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                opacity: 0.5
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -30,
                                left: -30,
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.15)',
                                opacity: 0.5
                            }}
                        />

                        {/* Icon and Text */}
                        <Box
                            sx={{
                                position: 'relative',
                                zIndex: 1,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
                                    border: '3px solid white'
                                }}
                            >
                                <StorefrontIcon style={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'success.dark',
                                    fontWeight: 700,
                                    textShadow: '0 1px 2px rgba(255,255,255,0.5)'
                                }}
                            >
                                {business.name}
                            </Typography>
                            
                            {/* Price Badge for No-Image Cards */}
                            <Box
                                sx={{
                                    mt: 1,
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                    color: 'white',
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                                    border: '2px solid rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 800,
                                        textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {formatPrice(business.price)}
                                </Typography>
                            </Box>

                            {/* Media Info Badge (if any media exists) */}
                            {hasMedia && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    {hasPhotos && (
                                        <Chip
                                            icon={<ImageIcon style={{ fontSize: 14 }} />}
                                            label={`${business.photos.length} photo${business.photos.length > 1 ? 's' : ''}`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                color: 'success.dark',
                                                fontWeight: 600,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    )}
                                    {hasVideos && (
                                        <Chip
                                            icon={<VideoIcon style={{ fontSize: 14 }} />}
                                            label={`${business.videos.length} vidéo${business.videos.length > 1 ? 's' : ''}`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(211, 47, 47, 0.9)',
                                                color: 'white',
                                                fontWeight: 600,
                                                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)'
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header Section - Only show name if image exists (otherwise shown in placeholder) */}
                    <Box sx={{ mb: 2 }}>
                        {firstImage && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        fontWeight: 'bold',
                                        flex: 1,
                                        lineHeight: 1.3,
                                        minHeight: '2.6em',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        color: 'text.primary'
                                    }}
                                >
                                    {business.name}
                                </Typography>
                                <Box sx={{ ml: 1, flexShrink: 0 }}>
                                    <Chip
                                        icon={<BusinessIcon style={{ fontSize: 14 }} />}
                                        label={business.businessNumber}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Business Number for no-image cards */}
                        {!firstImage && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Chip
                                    icon={<BusinessIcon style={{ fontSize: 14 }} />}
                                    label={`N° ${business.businessNumber}`}
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                        )}

                        {/* Key Details in Grid */}
                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                            {/* Location */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MapPinIcon style={{ marginRight: 10, color: '#2e7d32', fontSize: 19, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {business.location}
                                </Typography>
                            </Box>

                            {/* Category */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon style={{ marginRight: 10, color: '#2e7d32', fontSize: 19, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {business.category}
                                </Typography>
                            </Box>

                            {/* Year Established & Employees */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                {business.yearEstablished && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarIcon style={{ marginRight: 7, color: '#2e7d32', fontSize: 18, flexShrink: 0 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                            Créée en {business.yearEstablished}
                                        </Typography>
                                    </Box>
                                )}

                                {business.employees && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PeopleIcon style={{ marginRight: 7, color: '#2e7d32', fontSize: 18, flexShrink: 0 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                            {business.employees} employés
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Description */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            lineHeight: 1.7,
                            minHeight: '5.1em',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.875rem'
                        }}
                    >
                        {truncateText(business.description)}
                    </Typography>

                    {/* Monthly Revenue */}
                    {business.monthlyRevenue && (
                        <Box
                            sx={{
                                mb: 2,
                                p: 1.5,
                                bgcolor: 'grey.50',
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'grey.300',
                                background: 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <TrendingUpIcon style={{ marginRight: 7, fontSize: 17, color: '#2e7d32' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.75rem' }}>
                                    Revenu mensuel estimé
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="success.dark" sx={{ fontWeight: 700, pl: 3 }}>
                                {formatPrice(business.monthlyRevenue)}
                            </Typography>
                        </Box>
                    )}

                    {/* Spacer to push footer to bottom */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Footer Section */}
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }} onClick={handleActionClick}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarIcon style={{ marginRight: 7, fontSize: 15, color: '#757575' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {formatDate(business.createdAt)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            color: 'error.main',
                                            bgcolor: 'error.light',
                                            transform: 'scale(1.2)'
                                        }
                                    }}
                                >
                                    <HeartIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'primary.light',
                                            transform: 'scale(1.2)'
                                        }
                                    }}
                                >
                                    <ShareIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {onClick && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="medium"
                                    fullWidth
                                    onClick={handleCardClick}
                                    startIcon={<EyeIcon />}
                                    sx={{
                                        flex: 1,
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 24px rgba(46, 125, 50, 0.35)'
                                        },
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        py: 1.2,
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)'
                                    }}
                                >
                                    Voir détails
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="success"
                                size="medium"
                                onClick={(e) => {
                                    handleActionClick(e);
                                    setShowInquiryDialog(true);
                                }}
                                startIcon={<InfoIcon />}
                                sx={{
                                    flex: onClick ? 0 : 1,
                                    minWidth: onClick ? '130px' : 'auto',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    py: 1.2,
                                    borderWidth: 2,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(46, 125, 50, 0.25)',
                                        borderWidth: 2
                                    }
                                }}
                            >
                                Contact
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
        </>
    );
}
// src/components/BusinessCard.jsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
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
    MdTrendingUp as TrendingUpIcon
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
            throw error; // Re-throw to let InquiryDialog handle it
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

    return (
        <>
            <Card
                elevation={2}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                        elevation: 8,
                        transform: onClick ? 'translateY(-8px)' : 'translateY(-4px)',
                        boxShadow: '0 16px 40px rgba(46, 125, 50, 0.25)',
                    },
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)',
                    }
                }}
                onClick={handleCardClick}
            >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header Section */}
                    <Box sx={{ mb: 2 }}>
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
                                    label={business.business_number}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ fontWeight: 500 }}
                                />
                            </Box>
                        </Box>

                        {/* Price - Prominent Display */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'success.light',
                                borderRadius: 1.5,
                                mb: 2,
                                border: '2px solid',
                                borderColor: 'success.main',
                                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.05) 100%)',
                            }}
                        >
                            <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600, display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Prix demandé
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                {formatPrice(business.price)}
                            </Typography>
                        </Box>

                        {/* Key Details in Grid */}
                        <Stack spacing={1} sx={{ mb: 2 }}>
                            {/* Location */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MapPinIcon style={{ marginRight: 8, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                    {business.location}
                                </Typography>
                            </Box>

                            {/* Category */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon style={{ marginRight: 8, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                    {business.category}
                                </Typography>
                            </Box>

                            {/* Year Established & Employees */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {business.year_established && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarIcon style={{ marginRight: 6, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                            {business.year_established}
                                        </Typography>
                                    </Box>
                                )}

                                {business.employees && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PeopleIcon style={{ marginRight: 6, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
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
                            lineHeight: 1.6,
                            minHeight: '4.8em',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {truncateText(business.description)}
                    </Typography>

                    {/* Monthly Revenue */}
                    {business.monthly_revenue && (
                        <Box
                            sx={{
                                mb: 2,
                                p: 1.5,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <TrendingUpIcon style={{ marginRight: 6, fontSize: 16, color: '#4caf50' }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Revenu mensuel estimé
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, pl: 3 }}>
                                {formatPrice(business.monthly_revenue)}
                            </Typography>
                        </Box>
                    )}

                    {/* Media Count Badge */}
                    {(business.photos?.length > 0 || business.videos?.length > 0) && (
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={`${business.photos?.length || 0} photo(s) • ${business.videos?.length || 0} vidéo(s)`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', borderColor: 'success.main', color: 'success.dark' }}
                            />
                        </Box>
                    )}

                    {/* Spacer to push footer to bottom */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Footer Section */}
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }} onClick={handleActionClick}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarIcon style={{ marginRight: 6, fontSize: 14, color: '#999' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(business.created_at)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'error.main',
                                            bgcolor: 'error.light',
                                            transform: 'scale(1.15)'
                                        }
                                    }}
                                >
                                    <HeartIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'primary.light',
                                            transform: 'scale(1.15)'
                                        }
                                    }}
                                >
                                    <ShareIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)'
                                        },
                                        fontWeight: 600,
                                        textTransform: 'none'
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
                                    minWidth: onClick ? '120px' : 'auto',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)'
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
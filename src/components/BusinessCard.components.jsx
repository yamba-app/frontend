import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Alert,
    Divider
} from '@mui/material';
import {
    MdLocationOn as MapPinIcon,
    MdCalendarToday as CalendarIcon,
    MdAttachMoney as DollarSignIcon,
    MdInfo as InfoIcon,
    MdClose as CloseIcon,
    MdSend as SendIcon,
    MdVisibility as EyeIcon,
    MdFavorite as HeartIcon,
    MdShare as ShareIcon,
    MdCategory as CategoryIcon,
    MdBusiness as BusinessIcon,
    MdPeople as PeopleIcon,
    MdTrendingUp as TrendingUpIcon
} from 'react-icons/md';

export function BusinessCard({ business, onClick, onAddInquiry }) {
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquirySubmitted, setInquirySubmitted] = useState(false);
    const [inquiryData, setInquiryData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleCardClick = () => {
        if (onClick) {
            onClick(business.id);
        }
    };

    const handleActionClick = (e) => {
        e.stopPropagation();
    };

    const handleInquirySubmit = (e) => {
        e.preventDefault();

        const inquiryWithBusinessInfo = {
            ...inquiryData,
            businessId: business.id,
            businessName: business.name,
            businessNumber: business.business_number
        };

        if (onAddInquiry) {
            onAddInquiry(inquiryWithBusinessInfo);
        }
        
        setInquirySubmitted(true);
        
        setTimeout(() => {
            setInquiryData({ name: '', phone: '', email: '', message: '' });
            setShowInquiryForm(false);
            setInquirySubmitted(false);
        }, 2000);
    };

    const handleInquiryChange = (e) => {
        setInquiryData({
            ...inquiryData,
            [e.target.name]: e.target.value
        });
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
                    '&:hover': {
                        elevation: 6,
                        transform: onClick ? 'translateY(-6px)' : 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(46, 125, 50, 0.2)',
                    },
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
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
                            label={business.businessNumber}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ mb: 1.5, fontWeight: 500 }}
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
                                border: '1px solid',
                                borderColor: 'success.main'
                            }}
                        >
                            <Typography variant="caption" color="success.dark" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                                Prix demandé
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                {formatPrice(business.price)}
                            </Typography>
                        </Box>

                        {/* Key Details in Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                            {/* Location */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MapPinIcon style={{ marginRight: 6, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                    {business.location}
                                </Typography>
                            </Box>

                            {/* Category */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon style={{ marginRight: 6, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                    {business.category}
                                </Typography>
                            </Box>

                            {/* Year Established */}
                            {business.yearEstablished && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarIcon style={{ marginRight: 6, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                        Créée en {business.yearEstablished}
                                    </Typography>
                                </Box>
                            )}

                            {/* Employees */}
                            {business.employees && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PeopleIcon style={{ marginRight: 6, color: '#4caf50', fontSize: 18, flexShrink: 0 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                        {business.employees} employés
                                    </Typography>
                                </Box>
                            )}
                        </Box>
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
                                sx={{ fontSize: '0.7rem' }}
                            />
                        </Box>
                    )}

                    {/* Spacer to push footer to bottom */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Footer Section */}
                    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }} onClick={handleActionClick}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarIcon style={{ marginRight: 6, fontSize: 14, color: '#666' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(business.created_at)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        color: 'text.secondary',
                                        '&:hover': { 
                                            color: 'error.main',
                                            bgcolor: 'error.light',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <HeartIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    sx={{ 
                                        color: 'text.secondary',
                                        '&:hover': { 
                                            color: 'primary.main',
                                            bgcolor: 'primary.light',
                                            transform: 'scale(1.1)'
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
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: 3
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
                                    setShowInquiryForm(true);
                                }}
                                startIcon={<InfoIcon />}
                                sx={{
                                    flex: onClick ? 0 : 1,
                                    minWidth: onClick ? '120px' : 'auto',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: 2
                                    }
                                }}
                            >
                                Contact
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Inquiry Form Dialog */}
            <Dialog
                open={showInquiryForm}
                onClose={() => setShowInquiryForm(false)}
                maxWidth="sm"
                fullWidth
                onClick={handleActionClick}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Demande d'information
                    <IconButton onClick={() => setShowInquiryForm(false)} sx={{ ml: 'auto' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {inquirySubmitted ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Votre demande d'information a été envoyée avec succès !
                        </Alert>
                    ) : (
                        <>
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {business.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {business.location} • {business.business_number}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark', mt: 1 }}>
                                    {formatPrice(business.price)}
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleInquirySubmit}>
                                <Grid container spacing={2}>
                                    <Grid size={{md:6,xs:12}}>
                                        <TextField
                                            fullWidth
                                            label="Votre nom complet *"
                                            name="name"
                                            value={inquiryData.name}
                                            onChange={handleInquiryChange}
                                            required
                                        />
                                    </Grid>

                                    <Grid size={{md:6,xs:12}}>
                                        <TextField
                                            fullWidth
                                            label="Numéro de téléphone *"
                                            name="phone"
                                            type="tel"
                                            placeholder="Ex: +226 70 XX XX XX"
                                            value={inquiryData.phone}
                                            onChange={handleInquiryChange}
                                            required
                                        />
                                    </Grid>

                                   <Grid size={{md:6,xs:12}}>
                                        <TextField
                                            fullWidth
                                            label="Email (optionnel)"
                                            name="email"
                                            type="email"
                                            value={inquiryData.email}
                                            onChange={handleInquiryChange}
                                        />
                                    </Grid>

                                    <Grid size={{md:12,xs:12}}>
                                        <TextField
                                            fullWidth
                                            label="Message ou questions (optionnel)"
                                            name="message"
                                            multiline
                                            rows={3}
                                            placeholder="Posez vos questions sur cette entreprise..."
                                            value={inquiryData.message}
                                            onChange={handleInquiryChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setShowInquiryForm(false)}>
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon />}
                        onClick={handleInquirySubmit}
                        disabled={inquirySubmitted}
                    >
                        Envoyer la demande
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
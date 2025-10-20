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
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Breadcrumbs,
    Link,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from '@mui/material';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaPhone,
    FaEnvelope,
    FaUser,
    FaInfoCircle,
    FaShare,
    FaHeart,
    FaHeartBroken,
    FaCheck,
    FaClock,
    FaTag,
    FaChartLine,
    FaUsers,
    FaTools
} from 'react-icons/fa';
import { useBusinessBySlug } from './services/homes.services';

export function BusinessDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showInquiryDialog, setShowInquiryDialog] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [inquirySubmitted, setInquirySubmitted] = useState(false);

    // Fetch data with React Query
    const { data: business, isLoading, isError } = useBusinessBySlug(id);

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

    const handleInquirySubmit = () => {
        console.log('Inquiry submitted:', inquiryForm);
        setInquirySubmitted(true);
        setTimeout(() => {
            setShowInquiryDialog(false);
            setInquirySubmitted(false);
            setInquiryForm({ name: '', email: '', phone: '', message: '' });
        }, 2000);
    };

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
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box textAlign="center" py={8}>
                    <CircularProgress size={60} sx={{ color: 'success.main' }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Chargement des détails...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Error or not found state
    if (isError || !business) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box textAlign="center" py={8}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Entreprise non trouvée
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                        startIcon={<FaArrowLeft />}
                        sx={{ mt: 2 }}
                    >
                        Retour à l'accueil
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    color="inherit"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}
                    sx={{ cursor: 'pointer' }}
                >
                    Accueil
                </Link>
                <Typography color="text.primary">{business.name}</Typography>
            </Breadcrumbs>

            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {business.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Chip
                                icon={<FaMapMarkerAlt />}
                                label={business.location}
                                variant="outlined"
                                color="primary"
                            />
                            <Chip
                                icon={<FaTag />}
                                label={business.category}
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                        <IconButton
                            onClick={() => setIsFavorite(!isFavorite)}
                            color={isFavorite ? 'error' : 'default'}
                            sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                        >
                            {isFavorite ? <FaHeart /> : <FaHeartBroken />}
                        </IconButton>
                        <IconButton
                            sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                        >
                            <FaShare />
                        </IconButton>
                    </Box>
                </Box>

                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {formatPrice(business.price)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Publié le {new Date(business.datePosted).toLocaleDateString('fr-FR')} • N° d'annonce: {business.businessNumber}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column - Images and Description */}
                <Grid size={{md:8,xs:12}}>
                    {/* Media Gallery */}
                    {allMedia.length > 0 && (
                        <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
                            {/* Main Media Display */}
                            <Box sx={{ position: 'relative', height: 400 }}>
                                {allMedia[currentMediaIndex]?.type === 'video' ? (
                                    <video
                                        src={allMedia[currentMediaIndex].url}
                                        controls
                                        autoPlay={false}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            backgroundColor: '#000'
                                        }}
                                    />
                                ) : (
                                    <Box
                                        component="img"
                                        src={allMedia[currentMediaIndex]?.url}
                                        alt={business.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                
                                {/* Media Type Indicator */}
                                <Chip
                                    label={allMedia[currentMediaIndex]?.type === 'video' ? 'Vidéo' : 'Photo'}
                                    size="small"
                                    color={allMedia[currentMediaIndex]?.type === 'video' ? 'error' : 'primary'}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        '& .MuiChip-label': {
                                            color: 'white'
                                        }
                                    }}
                                />
                                
                                {/* Media Counter */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 16,
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {currentMediaIndex + 1} / {allMedia.length}
                                </Box>
                            </Box>
                            
                            {/* Thumbnails */}
                            {allMedia.length > 1 && (
                                <Box 
                                    display="flex" 
                                    gap={1} 
                                    p={2} 
                                    sx={{ 
                                        overflowX: 'auto',
                                        '&::-webkit-scrollbar': {
                                            height: 6,
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: '#f1f1f1',
                                            borderRadius: 3,
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#888',
                                            borderRadius: 3,
                                            '&:hover': {
                                                backgroundColor: '#555',
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
                                                minWidth: 80,
                                                height: 60,
                                                cursor: 'pointer',
                                                border: currentMediaIndex === index ? 3 : 1,
                                                borderColor: currentMediaIndex === index ? 'success.main' : 'grey.300',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    borderColor: 'success.main',
                                                    transform: 'scale(1.05)',
                                                    transition: 'all 0.2s ease'
                                                }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={media.url}
                                                alt={`${business.name} ${index + 1}`}
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
                                                        bgcolor: 'rgba(0,0,0,0.4)',
                                                        color: 'white'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            bgcolor: 'rgba(255,255,255,0.9)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: 'black',
                                                                fontSize: '12px',
                                                                lineHeight: 1,
                                                                marginLeft: '2px'
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
                            <Box sx={{ px: 2, pb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {business.photos?.length || 0} photo{(business.photos?.length || 0) !== 1 ? 's' : ''}
                                    {business.videos?.length > 0 && 
                                        ` • ${business.videos.length} vidéo${business.videos.length !== 1 ? 's' : ''}`
                                    }
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    {/* Description */}
                    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Description de l'entreprise
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                            {business.description}
                        </Typography>
                        {business.additionalInfo && (
                            <Typography variant="body2" color="text.secondary">
                                {business.additionalInfo}
                            </Typography>
                        )}
                    </Paper>

                    {/* Business Details */}
                    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Détails de l'entreprise
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={6}>
                                <List>
                                    <ListItem>
                                        <ListItemIcon><FaCalendarAlt color="#2e7d32" /></ListItemIcon>
                                        <ListItemText
                                            primary="Année de création"
                                            secondary={business.yearEstablished}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><FaUsers color="#2e7d32" /></ListItemIcon>
                                        <ListItemText
                                            primary="Nombre d'employés"
                                            secondary={business.employees}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><FaChartLine color="#2e7d32" /></ListItemIcon>
                                        <ListItemText
                                            primary="Chiffre d'affaires mensuel"
                                            secondary={business.monthlyRevenue ? formatPrice(business.monthlyRevenue) : 'Non spécifié'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Avantages de cette entreprise:
                                </Typography>
                                <List dense>
                                    {business.advantages?.map((advantage, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon><FaCheck color="#2e7d32" size={12} /></ListItemIcon>
                                            <ListItemText primary={advantage} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Assets */}
                    {business.assets && business.assets.length > 0 && (
                        <Paper elevation={1} sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                <FaTools style={{ marginRight: 8 }} />
                                Équipements et actifs inclus
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {business.assets.map((asset, index) => (
                                    <Chip
                                        key={index}
                                        label={asset}
                                        variant="outlined"
                                        color="success"
                                    />
                                ))}
                            </Box>
                        </Paper>
                    )}
                </Grid>

                {/* Right Column - Contact Info */}
                <Grid size={{md:4,xs:12}}>

                    {/* Contact Card */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Contacter le vendeur
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                                <FaUser />
                            </Avatar>
                            <Box>
                                <Typography variant="h6">{business.owner?.name || business.contactName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Membre actif
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box mb={3}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <FaPhone color="#2e7d32" />
                                <Typography>{business.owner?.phone || business.contactPhone}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <FaEnvelope color="#2e7d32" />
                                <Typography sx={{ wordBreak: 'break-word' }}>
                                    {business.owner?.email || business.contactEmail}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <FaMapMarkerAlt color="#2e7d32" />
                                <Typography variant="body2">
                                    {business.fullAddress || business.location}
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={() => setShowInquiryDialog(true)}
                            sx={{
                                bgcolor: 'success.main',
                                '&:hover': { bgcolor: 'success.dark' },
                                mb: 2,
                                py: 1.5
                            }}
                        >
                            Envoyer un message
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            href={`tel:${business.owner?.phone || business.contactPhone}`}
                            sx={{
                                borderColor: 'success.main',
                                color: 'success.main',
                                '&:hover': {
                                    borderColor: 'success.dark',
                                    color: 'success.dark',
                                    bgcolor: 'success.light'
                                }
                            }}
                        >
                            <FaPhone style={{ marginRight: 8 }} />
                            Appeler maintenant
                        </Button>
                    </Paper>

                    {/* Quick Info Card */}
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            <FaInfoCircle style={{ marginRight: 8 }} />
                            Informations rapides
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Prix"
                                    secondary={formatPrice(business.price)}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Catégorie"
                                    secondary={business.category}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Localisation"
                                    secondary={business.location}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="CA annuel"
                                    secondary={business.yearlyRevenue ? formatPrice(business.yearlyRevenue) : 'Non spécifié'}
                                />
                            </ListItem>
                            {business.reasons && (
                                <ListItem>
                                    <ListItemText
                                        primary="Raison de vente"
                                        secondary={business.reasons}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Back Button */}
            <Box sx={{ mt: 4 }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    startIcon={<FaArrowLeft />}
                >
                    Retour aux annonces
                </Button>
            </Box>

            {/* Inquiry Dialog */}
            <Dialog
                open={showInquiryDialog}
                onClose={() => setShowInquiryDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Contacter {business.owner?.name || business.contactName}
                </DialogTitle>
                <DialogContent>
                    {inquirySubmitted ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Votre message a été envoyé avec succès !
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Envoyez un message concernant: <strong>{business.name}</strong>
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom complet"
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({
                                            ...inquiryForm,
                                            name: e.target.value
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Téléphone"
                                        value={inquiryForm.phone}
                                        onChange={(e) => setInquiryForm({
                                            ...inquiryForm,
                                            phone: e.target.value
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={inquiryForm.email}
                                        onChange={(e) => setInquiryForm({
                                            ...inquiryForm,
                                            email: e.target.value
                                        })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        fullWidth
                                        label="Votre message"
                                        multiline
                                        rows={4}
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({
                                            ...inquiryForm,
                                            message: e.target.value
                                        })}
                                        placeholder="Décrivez votre intérêt pour cette entreprise..."
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowInquiryDialog(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleInquirySubmit}
                        disabled={inquirySubmitted}
                        sx={{
                            bgcolor: 'success.main',
                            '&:hover': { bgcolor: 'success.dark' }
                        }}
                    >
                        Envoyer le message
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
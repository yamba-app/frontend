// AdminBusinessViewPage.jsx - Complete Premium Design
// Perfectly aligned with your Business model and database schema

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Paper, Grid, Button, Chip, Divider,
    Alert, Breadcrumbs, Link, Avatar, List, ListItem, ListItemIcon,
    ListItemText, CircularProgress, Card, Stack, IconButton, Fade,
    Zoom, Slide, Tooltip, Table, TableBody, TableCell, TableContainer,
    TableRow
} from '@mui/material';
import {
    FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaEnvelope,
    FaUser, FaInfoCircle, FaTag, FaChartLine, FaUsers, FaTools,
    FaEdit, FaCheckCircle, FaTimesCircle, FaClock, FaShoppingCart,
    FaIdCard, FaBuilding, FaDollarSign, FaFileAlt, FaHistory,
    FaChevronRight, FaChevronLeft, FaExpand, FaCamera, FaVideo,
    FaDownload, FaShare, FaPrint, FaTrophy, FaAward, FaStar,
    FaUserTie, FaExclamationTriangle
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../core/instance/axiosprivate.instance';

export function AdminBusinessViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [mediaExpanded, setMediaExpanded] = useState(false);

    // Fetch business with all relationships (approver, rejector, buyer)
    const { data: businessData, isLoading, isError } = useQuery({
        queryKey: ['adminBusinessView', id],
        queryFn: async () => {
            const response = await axiosPrivate.get(`api/admin/businesses/${id}`);
            return response.data?.data;
        },
        enabled: !!id,
    });

    const business = businessData;

    // Combine photo_urls and video_urls from backend
    const allMedia = React.useMemo(() => {
        if (!business) return [];
        const photos = (business.photos|| []).map(url => ({ type: 'photo', url }));
        const videos = (business.videos || []).map(url => ({ type: 'video', url }));
        return [...photos, ...videos];
    }, [business]);

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'warning',
                icon: <FaClock />,
                label: 'En attente',
                gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                bgColor: 'rgba(245, 158, 11, 0.1)'
            },
            approved: {
                color: 'success',
                icon: <FaCheckCircle />,
                label: 'Approuvé',
                gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                bgColor: 'rgba(16, 185, 129, 0.1)'
            },
            rejected: {
                color: 'error',
                icon: <FaTimesCircle />,
                label: 'Rejeté',
                gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                bgColor: 'rgba(239, 68, 68, 0.1)'
            },
            bought: {
                color: 'info',
                icon: <FaShoppingCart />,
                label: 'Acheté',
                gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                bgColor: 'rgba(59, 130, 246, 0.1)'
            },
        };
        return configs[status] || configs.pending;
    };

    const nextMedia = () => setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
    const prevMedia = () => setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);

    // Premium Loading State
    if (isLoading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Paper elevation={24} sx={{
                    p: 6,
                    borderRadius: 4,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <CircularProgress size={80} thickness={4} sx={{ color: '#667eea', mb: 3 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                        Chargement des détails...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Préparation de l'affichage premium
                    </Typography>
                </Paper>
            </Box>
        );
    }

    // Error State
    if (isError || !business) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Paper elevation={12} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                    <FaTimesCircle size={64} color="#ef4444" />
                    <Typography variant="h4" color="error" gutterBottom sx={{ fontWeight: 700, mt: 2 }}>
                        Entreprise non trouvée
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        L'entreprise demandée n'existe pas ou a été supprimée.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/admin/businesses')}
                        startIcon={<FaArrowLeft />}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        Retour à la liste
                    </Button>
                </Paper>
            </Container>
        );
    }

    const statusConfig = getStatusConfig(business.status);

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)',
            pb: 6
        }}>
            <Container maxWidth="xl" sx={{ pt: 4 }}>
                {/* Breadcrumbs */}
                <Fade in timeout={500}>
                    <Paper elevation={0} sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <Breadcrumbs separator={<FaChevronRight size={12} />}>
                            <Link
                                color="inherit"
                                onClick={() => navigate('/admin/businesses')}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    '&:hover': { color: '#667eea' },
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaBuilding size={14} />
                                Gestion des entreprises
                            </Link>
                            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                                {business?.name}
                            </Typography>
                        </Breadcrumbs>
                    </Paper>
                </Fade>

                {/* Premium Header Card */}
                <Zoom in timeout={600}>
                    <Paper elevation={12} sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: statusConfig.gradient
                        }
                    }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid size={{md:8, xs:12}}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Avatar sx={{
                                        width: 64,
                                        height: 64,
                                        background: statusConfig.gradient,
                                        boxShadow: `0 8px 24px ${statusConfig.bgColor}`
                                    }}>
                                        <FaBuilding size={32} />
                                    </Avatar>
                                    <Box flex={1}>
                                        <Typography variant="h3" sx={{
                                            fontWeight: 900,
                                            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: 1
                                        }}>
                                            {business.name}
                                        </Typography>
                                        <Box display="flex" gap={1.5} flexWrap="wrap">
                                            <Chip
                                                icon={statusConfig.icon}
                                                label={statusConfig.label}
                                                sx={{
                                                    background: statusConfig.gradient,
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '0.875rem',
                                                    height: 32,
                                                    boxShadow: `0 4px 12px ${statusConfig.bgColor}`,
                                                    '& .MuiChip-icon': { color: 'white' }
                                                }}
                                            />
                                            <Chip
                                                icon={<FaIdCard />}
                                                label={business.businessNumber}
                                                variant="outlined"
                                                sx={{ fontWeight: 600, borderWidth: 2, height: 32 }}
                                            />
                                            <Chip
                                                icon={<FaTag />}
                                                label={business.category}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    height: 32
                                                }}
                                            />
                                            <Chip
                                                icon={<FaMapMarkerAlt />}
                                                label={business.location}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    height: 32
                                                }}
                                            />
                                            {business.verified && (
                                                <Chip
                                                    icon={<FaAward />}
                                                    label="Vérifié"
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        height: 32
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                <Paper elevation={0} sx={{
                                    p: 3,
                                    mt: 2,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white'
                                }}>
                                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                                        {formatPrice(business.price)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Prix demandé • CA annuel: {formatPrice(business.yearlyRevenue)}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid size={{md:4, xs:12}}>
                                <Stack spacing={2}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        startIcon={<FaEdit />}
                                        onClick={() => navigate(`/admin/businesses/${business.id}`)}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            py: 1.5,
                                            borderRadius: 3,
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                                            }
                                        }}
                                    >
                                        Modifier l'entreprise
                                    </Button>

                                    <Box display="flex" gap={2}>
                                        <Tooltip title="Partager">
                                            <IconButton sx={{
                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(59, 130, 246, 0.2)',
                                                    transform: 'scale(1.1)'
                                                }
                                            }}>
                                                <FaShare color="#3b82f6" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Imprimer">
                                            <IconButton sx={{
                                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(139, 92, 246, 0.2)',
                                                    transform: 'scale(1.1)'
                                                }
                                            }}>
                                                <FaPrint color="#8b5cf6" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Télécharger">
                                            <IconButton sx={{
                                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                                                    transform: 'scale(1.1)'
                                                }
                                            }}>
                                                <FaDownload color="#10b981" />
                                            </IconButton>
                                        </Tooltip>
                                        <Button
                                            variant="outlined"
                                            startIcon={<FaArrowLeft />}
                                            onClick={() => navigate('/admin/businesses')}
                                            sx={{
                                                flex: 1,
                                                borderWidth: 2,
                                                borderRadius: 3,
                                                fontWeight: 600,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    transform: 'translateX(-4px)'
                                                }
                                            }}
                                        >
                                            Retour
                                        </Button>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Zoom>

                <Grid container spacing={3}>
                    {/* Left Column - Media & Details */}
                    <Grid size={{md:8, xs:12}}>
                        {/* Premium Media Gallery */}
                        {allMedia?.length > 0 && (
                            <Slide direction="up" in timeout={700}>
                                <Paper elevation={12} sx={{
                                    mb: 3,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    background: '#000'
                                }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Box sx={{ height: mediaExpanded ? 600 : 500, position: 'relative' }}>
                                            {allMedia[currentMediaIndex]?.type === 'video' ? (
                                                <video
                                                    src={allMedia[currentMediaIndex].url}
                                                    controls
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
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
                                                        objectFit: 'contain',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                />
                                            )}

                                            {/* Navigation Arrows */}
                                            {allMedia?.length > 1 && (
                                                <>
                                                    <IconButton
                                                        onClick={prevMedia}
                                                        sx={{
                                                            position: 'absolute',
                                                            left: 16,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                            color: 'white',
                                                            backdropFilter: 'blur(10px)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 0, 0, 0.9)',
                                                                transform: 'translateY(-50%) scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <FaChevronLeft />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={nextMedia}
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 16,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                            color: 'white',
                                                            backdropFilter: 'blur(10px)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 0, 0, 0.9)',
                                                                transform: 'translateY(-50%) scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <FaChevronRight />
                                                    </IconButton>
                                                </>
                                            )}

                                            {/* Overlay Controls */}
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 16,
                                                left: 16,
                                                right: 16,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Chip
                                                    icon={allMedia[currentMediaIndex]?.type === 'video' ? <FaVideo /> : <FaCamera />}
                                                    label={allMedia[currentMediaIndex]?.type === 'video' ? 'Vidéo' : 'Photo'}
                                                    sx={{
                                                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                        color: 'white',
                                                        backdropFilter: 'blur(10px)',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': { color: 'white' }
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => setMediaExpanded(!mediaExpanded)}
                                                    sx={{
                                                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                        color: 'white',
                                                        backdropFilter: 'blur(10px)',
                                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.9)' }
                                                    }}
                                                >
                                                    <FaExpand />
                                                </IconButton>
                                            </Box>

                                            {/* Counter */}
                                            <Box sx={{
                                                position: 'absolute',
                                                bottom: 16,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                px: 3,
                                                py: 1,
                                                borderRadius: 3,
                                                backdropFilter: 'blur(10px)',
                                                fontWeight: 700
                                            }}>
                                                {currentMediaIndex + 1} / {allMedia.length}
                                            </Box>
                                        </Box>

                                        {/* Thumbnails */}
                                        {allMedia?.length > 1 && (
                                            <Box sx={{
                                                display: 'flex',
                                                gap: 1.5,
                                                p: 2,
                                                bgcolor: '#0f0f0f',
                                                overflowX: 'auto',
                                                '&::-webkit-scrollbar': { height: 8 },
                                                '&::-webkit-scrollbar-track': { bgcolor: '#1a1a1a' },
                                                '&::-webkit-scrollbar-thumb': {
                                                    bgcolor: '#667eea',
                                                    borderRadius: 4,
                                                    '&:hover': { bgcolor: '#764ba2' }
                                                }
                                            }}>
                                                {allMedia?.map((media, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => setCurrentMediaIndex(index)}
                                                        sx={{
                                                            position: 'relative',
                                                            minWidth: 120,
                                                            height: 80,
                                                            cursor: 'pointer',
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            border: currentMediaIndex === index ? '3px solid #667eea' : '2px solid transparent',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                                border: '3px solid #667eea'
                                                            }
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={media.url}
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                opacity: currentMediaIndex === index ? 1 : 0.6,
                                                                transition: 'opacity 0.3s'
                                                            }}
                                                        />
                                                        {media.type === 'video' && (
                                                            <Box sx={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                bgcolor: 'rgba(102, 126, 234, 0.9)',
                                                                borderRadius: '50%',
                                                                width: 32,
                                                                height: 32,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white'
                                                            }}>
                                                                <FaVideo size={14} />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </Slide>
                        )}

                        {/* Description Card */}
                        <Fade in timeout={800}>
                            <Paper elevation={8} sx={{
                                p: 4,
                                mb: 3,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '6px',
                                    height: '100%',
                                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
                                }
                            }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <Avatar sx={{ bgcolor: '#667eea', width: 48, height: 48 }}>
                                        <FaFileAlt size={24} />
                                    </Avatar>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                        Description détaillée
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />
                                <Typography
                                    variant="body1"
                                    
                                    sx={{
                                        lineHeight: 2,
                                        fontSize: '1.05rem',
                                        color: '#334155'
                                    }}
                                >
                                    {business.description}
                                </Typography>
                                {business.additionalInfo && (
                                    <Alert
                                        severity="info"
                                        icon={<FaInfoCircle />}
                                        sx={{ mt: 3, borderRadius: 2 }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                            Informations supplémentaires:
                                        </Typography>
                                        <Typography variant="body2">
                                            {business.additionalInfo}
                                        </Typography>
                                    </Alert>
                                )}
                                {business.reasons && (
                                    <Alert
                                        severity="warning"
                                        icon={<FaExclamationTriangle />}
                                        sx={{ mt: 2, borderRadius: 2 }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                            Raison de vente:
                                        </Typography>
                                        <Typography variant="body2">
                                            {business.reasons}
                                        </Typography>
                                    </Alert>
                                )}
                            </Paper>
                        </Fade>

                        {/* Financial Metrics Grid */}
                        <Fade in timeout={900}>
                            <Paper elevation={8} sx={{ p: 4, mb: 3, borderRadius: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={3}>
                                    <Avatar sx={{ bgcolor: '#10b981', width: 48, height: 48 }}>
                                        <FaChartLine size={24} />
                                    </Avatar>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                        Détails financiers & opérationnels
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={2}>
                                    <Grid size={{md:3, xs:12,sm:6}}  >
                                        <Card sx={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: 'white',
                                            borderRadius: 3,
                                            p: 2.5,
                                            height: '100%'
                                        }}>
                                            <FaCalendarAlt size={28} style={{ marginBottom: 12 }} />
                                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {business.yearEstablished || 'N/A'}
                                            </Typography>
                                          <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                Année de création
                                            </Typography>
                                        </Card>
                                    </Grid>
                                    <Grid size={{md:3, xs:12,sm:6}}  >
                                        <Card sx={{
                                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                            color: 'white',
                                            borderRadius: 3,
                                            p: 2.5,
                                            height: '100%'
                                        }}>
                                            <FaUsers size={28} style={{ marginBottom: 12 }} />
                                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {business?.employees || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                Employés
                                            </Typography>
                                        </Card>
                                    </Grid>
                                    <Grid size={{md:3, xs:12,sm:6}}  >
                                        <Card sx={{
                                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                            color: 'white',
                                            borderRadius: 3,
                                            p: 2.5,
                                            height: '100%'
                                        }}>
                                            <FaDollarSign size={28} style={{ marginBottom: 12 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                                                {formatPrice(business?.monthlyRevenue)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                CA mensuel
                                            </Typography>
                                        </Card>
                                    </Grid>
                                   <Grid size={{md:3, xs:12,sm:6}}  >
                                        <Card sx={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            borderRadius: 3,
                                            p: 2.5,
                                            height: '100%'
                                        }}>
                                            <FaTrophy size={28} style={{ marginBottom: 12 }} />
                                            <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                                                {formatPrice(business.yearlyRevenue)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                CA annuel
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Advantages Section */}
                                {business?.advantages && business?.advantages.length > 0 && (
                                    <Box mt={4}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                                            <FaStar style={{ marginRight: 8, color: '#f59e0b' }} />
                                            Avantages compétitifs:
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1.5}>
                                            {business?.advantages.map((adv, i) => (
                                                <Chip
                                                    key={i}
                                                    icon={<FaCheckCircle />}
                                                    label={adv}
                                                    sx={{
                                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                        color: '#059669',
                                                        fontWeight: 600,
                                                        py: 2.5,
                                                        '& .MuiChip-icon': { color: '#10b981' }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        </Fade>

                        {/* Assets Section */}
                        {business?.assets && business.assets.length > 0 && (
                            <Fade in timeout={1000}>
                                <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: '#f59e0b', width: 48, height: 48 }}>
                                            <FaTools size={24} />
                                        </Avatar>
                                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                            Équipements & Actifs inclus
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 3 }} />
                                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                                        {business?.assets.map((asset, i) => (
                                            <Chip
                                                key={i}
                                                label={asset}
                                                variant="outlined"
                                                sx={{
                                                    borderWidth: 2,
                                                    borderColor: '#f59e0b',
                                                    color: '#d97706',
                                                    fontWeight: 600,
                                                    py: 2.5,
                                                    '&:hover': {
                                                        bgcolor: 'rgba(245, 158, 11, 0.1)',
                                                        transform: 'scale(1.05)',
                                                        transition: 'all 0.2s'
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Fade>
                        )}
                    </Grid>

                    {/* Right Column - Timeline & Info Cards */}
                   <Grid size={{md:4, xs:12,sm:12}}  >
                        {/* Status Timeline Card */}
                        <Slide direction="left" in timeout={800}>
                            <Paper elevation={8} sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
                            }}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Avatar sx={{ bgcolor: '#6366f1', width: 40, height: 40 }}>
                                        <FaHistory size={20} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Historique du statut
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={3}>
                                    {/* Created */}
                                    <Box sx={{
                                        position: 'relative',
                                        pl: 3,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: -24,
                                            width: 3,
                                            bgcolor: '#3b82f6'
                                        }
                                    }}>
                                        <Box sx={{
                                            position: 'absolute',
                                            left: -6,
                                            top: 4,
                                            width: 15,
                                            height: 15,
                                            borderRadius: '50%',
                                            bgcolor: '#3b82f6',
                                            border: '3px solid white',
                                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                                        }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', mb: 0.5 }}>
                                            Créé
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(business.createdAt)}
                                        </Typography>
                                    </Box>

                                    {/* Approved */}
                                    {business.approvedAt && (
                                        <Box sx={{
                                            position: 'relative',
                                            pl: 3,
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: business.approvedAt ? -24 : 0,
                                                width: 3,
                                                bgcolor: '#10b981'
                                            }
                                        }}>
                                            <Box sx={{
                                                position: 'absolute',
                                                left: -6,
                                                top: 4,
                                                width: 15,
                                                height: 15,
                                                borderRadius: '50%',
                                                bgcolor: '#10b981',
                                                border: '3px solid white',
                                                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
                                            }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10b981', mb: 0.5 }}>
                                                Approuvé
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                {formatDate(business.approvedAt)}
                                            </Typography>
                                            {business.approver && (
                                                <Chip
                                                    avatar={<Avatar sx={{ bgcolor: '#10b981' }}><FaUserTie size={12} /></Avatar>}
                                                    label={business.approver.name}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                        </Box>
                                    )}

                                    {/* Rejected */}
                                    {business.rejectedAt && (
                                        <Box sx={{
                                            position: 'relative',
                                            pl: 3
                                        }}>
                                            <Box sx={{
                                                position: 'absolute',
                                                left: -6,
                                                top: 4,
                                                width: 15,
                                                height: 15,
                                                borderRadius: '50%',
                                                bgcolor: '#ef4444',
                                                border: '3px solid white',
                                                boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)'
                                            }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ef4444', mb: 0.5 }}>
                                                Rejeté
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                {formatDate(business.rejectedAt)}
                                            </Typography>
                                            {business.rejector && (
                                                <Chip
                                                    avatar={<Avatar sx={{ bgcolor: '#ef4444' }}><FaUserTie size={12} /></Avatar>}
                                                    label={business.rejector.name}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                            {business.rejectionReason && (
                                                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                        Raison: {business.rejectionReason}
                                                    </Typography>
                                                </Alert>
                                            )}
                                        </Box>
                                    )}

                                    {/* Bought */}
                                    {business.boughtAt && (
                                        <Box sx={{
                                            position: 'relative',
                                            pl: 3
                                        }}>
                                            <Box sx={{
                                                position: 'absolute',
                                                left: -6,
                                                top: 4,
                                                width: 15,
                                                height: 15,
                                                borderRadius: '50%',
                                                bgcolor: '#3b82f6',
                                                border: '3px solid white',
                                                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                                            }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3b82f6', mb: 0.5 }}>
                                                Acheté
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                {formatDate(business.boughtAt)}
                                            </Typography>
                                            {business.buyer && (
                                                <Chip
                                                    avatar={<Avatar sx={{ bgcolor: '#3b82f6' }}><FaUserTie size={12} /></Avatar>}
                                                    label={business.buyer.name}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                        </Box>
                                    )}
                                </Stack>

                                {/* Admin Notes */}
                                {business.adminNotes && (
                                    <Alert severity="info" icon={<FaInfoCircle />} sx={{ mt: 3, borderRadius: 2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                            Notes administratives:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {business.adminNotes}
                                        </Typography>
                                    </Alert>
                                )}
                            </Paper>
                        </Slide>

                        {/* Submitter Info Card */}
                        <Slide direction="left" in timeout={900}>
                            <Paper elevation={8} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Avatar sx={{ bgcolor: '#8b5cf6', width: 40, height: 40 }}>
                                        <FaUser size={20} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Soumissionnaire
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, borderBottom: 'none', py: 1.5 }}>
                                                    Nom:
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                                                    {business.submitterName || 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, borderBottom: 'none', py: 1.5 }}>
                                                    Email:
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                                                    {business.submitterEmail || 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, borderBottom: 'none', py: 1.5 }}>
                                                    Téléphone:
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                                                    {business.submitterPhone || 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {business.submitterNotes && (
                                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                            Notes du soumissionnaire:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {business.submitterNotes}
                                        </Typography>
                                    </Alert>
                                )}
                            </Paper>
                        </Slide>

                        {/* Business Contact Card */}
                        <Slide direction="left" in timeout={1000}>
                            <Paper elevation={8} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Avatar sx={{ bgcolor: '#ec4899', width: 40, height: 40 }}>
                                        <FaBuilding size={20} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Contact entreprise
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <List sx={{ p: 0 }}>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <FaUser color="#ec4899" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="caption" color="text.secondary">Contact</Typography>}
                                            secondary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{business.contactName || 'N/A'}</Typography>}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <FaPhone color="#ec4899" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="caption" color="text.secondary">Téléphone</Typography>}
                                            secondary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{business.contactPhone || 'N/A'}</Typography>}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <FaEnvelope color="#ec4899" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="caption" color="text.secondary">Email</Typography>}
                                            secondary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{business.contactEmail || 'N/A'}</Typography>}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <FaMapMarkerAlt color="#ec4899" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="caption" color="text.secondary">Adresse</Typography>}
                                            secondary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{business.fullAddress || business.location}</Typography>}
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Slide>

                        {/* Quick Info Summary */}
                        <Slide direction="left" in timeout={1100}>
                            <Paper elevation={8} sx={{ p: 3, borderRadius: 4 }}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Avatar sx={{ bgcolor: '#f59e0b', width: 40, height: 40 }}>
                                        <FaInfoCircle size={20} />
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        Résumé rapide
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Slug
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {business.slug}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Vérifié
                                        </Typography>
                                        <Box mt={0.5}>
                                            {business.verified ? (
                                                <Chip
                                                    icon={<FaCheckCircle />}
                                                    label="Oui"
                                                    size="small"
                                                    color="success"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            ) : (
                                                <Chip
                                                    icon={<FaTimesCircle />}
                                                    label="Non"
                                                    size="small"
                                                    color="default"
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Médias
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {(business.photos?.length || 0)} photo(s) • {(business.videos?.length || 0)} vidéo(s)
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Dernière modification
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {formatDate(business.updatedAt)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Slide>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AdminBusinessViewPage;
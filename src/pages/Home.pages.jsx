import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import { FaPlus, FaSearch, FaFilter, FaTimes, FaRedo } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa6';
import { BusinessCard } from '../components/BusinessCard.components';
import { BusinessForm } from '../components/BusinessForm.components';
import { InputField, SelectField } from '../components/Form.components';
import { useBusinesses, useCategories, useLocations } from './services/homes.services';

const ITEMS_PER_PAGE = 9;

export function HomePage() {
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data with React Query
    const { data: businessData, isLoading, isError } = useBusinesses({
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
        category: categoryFilter,
        location: locationFilter,
        search: searchTerm,
    });

    const { data: categoriesData } = useCategories();
    const { data: locationsData } = useLocations();

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, locationFilter, categoryFilter]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: document.querySelector('#business-listings')?.offsetTop - 100 || 0,
            behavior: 'smooth'
        });
    };

    const handleBusinessClick = (businessId) => {
        navigate(`/business/${businessId}`);
    };

    // Check if any filters are active
    const hasActiveFilters = searchTerm || locationFilter || categoryFilter;

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setCategoryFilter('');
        setCurrentPage(1);
    };

    // Extract data from API response
    const businesses = businessData?.data?.data || [];
    const meta = businessData?.data?.meta || {};
    const totalPages = meta.total_pages || 0;
    const totalBusinesses = meta.total || 0;

    // Process categories for SelectField
    const categoryOptions = categoriesData?.map(cat => ({
        key: cat.category.toLowerCase().replace(/\s+/g, '_'),
        value: cat.category,
        description: `${cat.count} entreprise${cat.count > 1 ? 's' : ''}`
    })) || [];

    // Process locations for SelectField
    const locationOptions = locationsData?.map(loc => ({
        key: loc.location.toLowerCase().replace(/\s+/g, '_'),
        value: loc.location,
        description: `${loc.count} entreprise${loc.count > 1 ? 's' : ''}`
    })) || [];

    // Loading state
    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Fade in={true} timeout={800}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <Box textAlign="center">
                            <CircularProgress size={70} thickness={4} sx={{ color: 'success.main' }} />
                            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
                                Chargement des entreprises...
                            </Typography>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        );
    }

    // Error state
    if (isError) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Fade in={true} timeout={800}>
                    <Box textAlign="center" py={8}>
                        <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
                            Erreur de chargement des données
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Une erreur s'est produite lors du chargement des entreprises.
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => window.location.reload()}
                            startIcon={<FaRedo />}
                            sx={{
                                bgcolor: 'success.main',
                                '&:hover': { bgcolor: 'success.dark' }
                            }}
                        >
                            Réessayer
                        </Button>
                    </Box>
                </Fade>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Fade in={true} timeout={600}>
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                            mb: 3,
                            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Vendez ou achetez une entreprise au Burkina Faso
                    </Typography>

                    <Typography
                        variant="h5"
                        component="p"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            lineHeight: 1.6
                        }}
                    >
                        La plateforme simple et sécurisée pour acheter et vendre des entreprises.
                        Trouvez l'opportunité qui vous convient ou vendez votre entreprise rapidement.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/add-business/')}
                        startIcon={<FaPlus color={'white'} />}
                        sx={{
                            background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                            color: "white",
                            px: 4,
                            py: 2,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            fontWeight: 700,
                            boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                                boxShadow: '0 6px 28px rgba(46, 125, 50, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Publier une entreprise à vendre
                    </Button>
                </Box>
            </Fade>

            {/* Search and Filter Section */}
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 4,
                        backgroundColor: 'background.paper',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Grid container spacing={3} sx={{  }}>
                        <Grid size={{ md: 5, sm: 12, xs: 12 }}>
                            <InputField
                                fullWidth
                                placeholder="Rechercher une entreprise..."
                                label={"Recherche"}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                prefix={<FaSearch />}
                            />
                        </Grid>
                        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
                            <SelectField
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                label="Filtrer par ville"
                                options={locationOptions}
                                searchPlaceholder='Rechercher'
                                prefixIcon={<FaFilter />}
                            />
                        </Grid>

                        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
                            <SelectField
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Filtrer par Category"
                                options={categoryOptions}
                                searchPlaceholder='Rechercher'
                                prefixIcon={<FaLayerGroup />}
                            />
                        </Grid>

                        {/* Reset Button - Only shows when filters are active */}
                        {hasActiveFilters && (
                            <Grid size={{ md: 1, sm: 12, xs: 12 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={handleResetFilters}
                                    startIcon={<FaTimes />}
                                    sx={{
                                        height: '56px',
                                        borderWidth: 2,
                                        fontWeight: 600,
                                        px: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'scale(1.05)',
                                            boxShadow: 2
                                        }
                                    }}

                                />
                                   
                            </Grid>
                        )}
                    </Grid>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <Fade in={true} timeout={400}>
                            <Box 
                                sx={{ 
                                    mt: 3, 
                                    pt: 3, 
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Filtres actifs:
                                </Typography>
                                
                                {searchTerm && (
                                    <Chip
                                        label={`Recherche: "${searchTerm}"`}
                                        onDelete={() => setSearchTerm('')}
                                        color="primary"
                                        variant="outlined"
                                        deleteIcon={<FaTimes />}
                                        sx={{ fontWeight: 500 }}
                                    />
                                )}
                                
                                {locationFilter && (
                                    <Chip
                                        label={`Ville: ${locationFilter}`}
                                        onDelete={() => setLocationFilter('')}
                                        color="primary"
                                        variant="outlined"
                                        deleteIcon={<FaTimes />}
                                        sx={{ fontWeight: 500 }}
                                    />
                                )}
                                
                                {categoryFilter && (
                                    <Chip
                                        label={`Catégorie: ${categoryFilter}`}
                                        onDelete={() => setCategoryFilter('')}
                                        color="primary"
                                        variant="outlined"
                                        deleteIcon={<FaTimes />}
                                        sx={{ fontWeight: 500 }}
                                    />
                                )}
                            </Box>
                        </Fade>
                    )}

                    {/* Results Summary */}
                    {totalBusinesses > 0 && (
                        <Box 
                            mt={3} 
                            sx={{ 
                                p: 2, 
                                bgcolor: 'success.light',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'success.main'
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.dark' }}>
                                🎯 {totalBusinesses} entreprise{totalBusinesses > 1 ? 's' : ''} trouvée{totalBusinesses > 1 ? 's' : ''}
                                {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Fade>

            {/* Business Listings */}
            <div id="business-listings">
                {businesses.length === 0 ? (
                    <Fade in={true} timeout={1000}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                textAlign: 'center', 
                                py: 10,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)'
                            }}
                        >
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                gutterBottom
                                sx={{ mb: 2, fontWeight: 600 }}
                            >
                                {searchTerm || locationFilter || categoryFilter ?
                                    '🔍 Aucune entreprise trouvée avec ces critères.' :
                                    '📋 Aucune entreprise publiée pour le moment.'
                                }
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                {hasActiveFilters ? 
                                    'Essayez de modifier vos critères de recherche.' :
                                    'Soyez le premier à publier une annonce !'
                                }
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => hasActiveFilters ? handleResetFilters() : navigate('/add-business/')}
                                startIcon={hasActiveFilters ? <FaRedo /> : <FaPlus />}
                                sx={{
                                    bgcolor: 'success.main',
                                    '&:hover': {
                                        bgcolor: 'success.dark',
                                    },
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                {hasActiveFilters ? 'Réinitialiser les filtres' : 'Publier une annonce'}
                            </Button>
                        </Paper>
                    </Fade>
                ) : (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {businesses.map((business, index) => (
                                <Grid size={{ md: 4, sm: 6, xs: 12 }} key={business.id}>
                                    <Fade in={true} timeout={600 + (index * 100)}>
                                        <div>
                                            <BusinessCard
                                                business={business}
                                                onClick={() => handleBusinessClick(business.slug)}
                                                showDetailsButton={true}
                                            />
                                        </div>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Fade in={true} timeout={1000}>
                                <Box display="flex" justifyContent="center" mt={6}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 3,
                                            backgroundColor: 'background.paper',
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Stack spacing={3} alignItems="center">
                                            <Pagination
                                                count={totalPages}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                                size="large"
                                                showFirstButton
                                                showLastButton
                                                sx={{
                                                    '& .MuiPaginationItem-root': {
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        transition: 'all 0.2s ease',
                                                        '&.Mui-selected': {
                                                            background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                                                            color: 'white',
                                                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                                                            },
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'success.light',
                                                            color: 'success.dark',
                                                            transform: 'scale(1.1)',
                                                        },
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Affichage de {meta.from || 0}-{meta.to || 0} sur {totalBusinesses} entreprises
                                            </Typography>
                                        </Stack>
                                    </Paper>
                                </Box>
                            </Fade>
                        )}
                    </>
                )}
            </div>

            {/* Business Form Modal/Dialog */}
            {showForm && (
                <BusinessForm
                    onSubmit={() => setShowForm(false)}
                    onClose={() => setShowForm(false)}
                />
            )}
        </Container>
    );
}
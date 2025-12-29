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
import Slider from "@mui/material/Slider";
import { FaPlus, FaSearch, FaFilter, FaTimes, FaRedo, FaMoneyBillWave } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa6';
import { BusinessCard } from '../components/BusinessCard.components';
import { BusinessForm } from '../components/BusinessForm.components';
import { InputField, SelectField } from '../components/Form.components';
import { useBusinesses } from './services/homes.services';
import burkinaCities from '../constants/City.constant';

const ITEMS_PER_PAGE = 9;

// Predefined price ranges (in FCFA)
const PRICE_RANGES = [
    { label: 'Tous les prix', min: 0, max: 1000000000 },
    { label: '0 - 1M FCFA', min: 0, max: 1000000 },
    { label: '1M - 5M FCFA', min: 1000000, max: 5000000 },
    { label: '5M - 10M FCFA', min: 5000000, max: 10000000 },
    { label: '10M - 25M FCFA', min: 10000000, max: 25000000 },
    { label: '25M - 50M FCFA', min: 25000000, max: 50000000 },
    { label: '50M - 100M FCFA', min: 50000000, max: 100000000 },
    { label: '100M+ FCFA', min: 100000000, max: 1000000000 },
];

// Helper function to format price
const formatPrice = (value) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(0)}M FCFA`;
    }
    return `${(value / 1000).toFixed(0)}K FCFA`;
};

export function HomePage() {
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRangeFilter, setPriceRangeFilter] = useState('');
    const [customPriceRange, setCustomPriceRange] = useState([0, 100000000]);
    const [showCustomPriceSlider, setShowCustomPriceSlider] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Get actual min/max prices from selected range
    const getActivePriceRange = () => {
        if (priceRangeFilter === 'custom') {
            return { min: customPriceRange[0], max: customPriceRange[1] };
        }
        if (priceRangeFilter && priceRangeFilter !== '') {
            const selected = PRICE_RANGES.find(range => range.label === priceRangeFilter);
            if (selected && selected.label !== 'Tous les prix') {
                return { min: selected.min, max: selected.max };
            }
        }
        return null;
    };

    const activePriceRange = getActivePriceRange();


    // Fetch data with React Query
    const { data: businessData, isLoading, isError } = useBusinesses({
        page: currentPage,
        perPage: ITEMS_PER_PAGE,
        category: categoryFilter,
        location: locationFilter,
        search: searchTerm,
        min_price: activePriceRange?.min,
        max_price: activePriceRange?.max,
    });



    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, locationFilter, categoryFilter, priceRangeFilter, customPriceRange]);

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

    const handlePriceRangeChange = (e) => {
        const value = e.target.value;
        setPriceRangeFilter(value);

        if (value === 'custom') {
            setShowCustomPriceSlider(true);
        } else {
            setShowCustomPriceSlider(false);
        }
    };

    // Check if any filters are active
    const hasActiveFilters = searchTerm || locationFilter || categoryFilter || priceRangeFilter;

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setCategoryFilter('');
        setPriceRangeFilter('');
        setCustomPriceRange([0, 100000000]);
        setShowCustomPriceSlider(false);
        setCurrentPage(1);
    };

    // Extract data from API response
    const businesses = businessData?.data?.data || [];
    const meta = businessData?.data?.meta || {};
    const totalPages = meta.total_pages || 0;
    const totalBusinesses = meta.total || 0;



    // Constants
    const categoryOptions = [
        { key: 'RESTAURANT', value: 'Restaurant' },
        { key: 'COMMERCE', value: 'Commerce' },
        { key: 'KIOSQUE', value: 'Kiosque' },
        { key: 'SERVICE', value: 'Service' },
        { key: 'PRODUCTION', value: 'Production' },
        { key: 'TRANSPORT', value: 'Transport' },
        { key: 'TECHNOLOGIE', value: 'Technologie' },
        { key: 'SANTE', value: 'Santé' },
        { key: 'EDUCATION', value: 'Éducation' },
        { key: 'AUTRE', value: 'Autre' }
    ];
   
    // Process price ranges for SelectField
    const priceRangeOptions = [
        ...PRICE_RANGES.map(range => ({
            key: range.label.toLowerCase().replace(/\s+/g, '_'),
            value: range.label,
            description: range.label === 'Tous les prix' ? 'Aucune limite' : range.label
        })),
        {
            key: 'custom',
            value: 'custom',
            description: 'Personnalisé'
        }
    ];

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
                    <Grid container spacing={3}>
                        {/* Search */}
                        <Grid size={{ md: 12, sm: 12, xs: 12 }}>
                            <InputField
                                fullWidth
                                placeholder="Rechercher une entreprise..."
                                label={"Recherche"}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                prefix={<FaSearch />}
                            />
                        </Grid>

                        {/* Location Filter */}
                        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
                            <SelectField
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                label="Ville"
                                options={burkinaCities}
                                searchPlaceholder='Rechercher'
                                prefixIcon={<FaFilter />}
                            />
                        </Grid>

                        {/* Category Filter */}
                        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
                            <SelectField
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Catégorie"
                                options={categoryOptions}
                                searchPlaceholder='Rechercher'
                                prefixIcon={<FaLayerGroup />}
                            />
                        </Grid>

                        {/* Price Range Filter */}
                        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                            <SelectField
                                value={priceRangeFilter}
                                onChange={handlePriceRangeChange}
                                label="Fourchette de prix"
                                options={priceRangeOptions}
                                searchPlaceholder='Rechercher'
                                prefixIcon={<FaMoneyBillWave />}
                            />
                        </Grid>

                        {/* Custom Price Slider */}
                        {showCustomPriceSlider && (
                            <Grid size={{ xs: 12 }}>
                                <Fade in={true} timeout={400}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            bgcolor: 'success.light',
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: 'success.main'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                mb: 3,
                                                fontWeight: 600,
                                                color: 'success.dark',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <FaMoneyBillWave />
                                            Prix personnalisé: {formatPrice(customPriceRange[0])} - {formatPrice(customPriceRange[1])}
                                        </Typography>
                                        <Slider
                                            value={customPriceRange}
                                            onChange={(e, newValue) => setCustomPriceRange(newValue)}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={formatPrice}
                                            min={0}
                                            max={100000000}
                                            step={1000000}
                                            marks={[
                                                { value: 0, label: '0' },
                                                { value: 25000000, label: '25M' },
                                                { value: 50000000, label: '50M' },
                                                { value: 75000000, label: '75M' },
                                                { value: 100000000, label: '100M+' },
                                            ]}
                                            sx={{
                                                color: 'success.main',
                                                '& .MuiSlider-thumb': {
                                                    width: 24,
                                                    height: 24,
                                                    backgroundColor: 'success.dark',
                                                    border: '3px solid white',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                    '&:hover, &.Mui-focusVisible': {
                                                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                                                    },
                                                },
                                                '& .MuiSlider-track': {
                                                    height: 6,
                                                    background: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)',
                                                },
                                                '& .MuiSlider-rail': {
                                                    height: 6,
                                                    opacity: 0.3,
                                                },
                                                '& .MuiSlider-mark': {
                                                    backgroundColor: 'success.dark',
                                                    height: 10,
                                                    width: 2,
                                                },
                                                '& .MuiSlider-markLabel': {
                                                    color: 'success.dark',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                },
                                                '& .MuiSlider-valueLabel': {
                                                    backgroundColor: 'success.dark',
                                                    fontWeight: 600,
                                                },
                                            }}
                                        />
                                    </Paper>
                                </Fade>
                            </Grid>
                        )}

                        {/* Reset Button */}
                        {hasActiveFilters && (
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={handleResetFilters}
                                    startIcon={<FaTimes />}
                                    sx={{
                                        height: '48px',
                                        borderWidth: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'scale(1.02)',
                                            boxShadow: 2
                                        }
                                    }}
                                >
                                    Réinitialiser tous les filtres
                                </Button>
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

                                {priceRangeFilter && priceRangeFilter !== 'Tous les prix' && (
                                    <Chip
                                        label={priceRangeFilter === 'custom'
                                            ? `Prix: ${formatPrice(customPriceRange[0])} - ${formatPrice(customPriceRange[1])}`
                                            : `Prix: ${priceRangeFilter}`
                                        }
                                        onDelete={() => {
                                            setPriceRangeFilter('');
                                            setShowCustomPriceSlider(false);
                                        }}
                                        color="success"
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
                                {hasActiveFilters ?
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
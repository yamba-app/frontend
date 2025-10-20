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
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
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
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    // Error state
    if (isError) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Erreur de chargement des données
                    </Typography>
                    <Button onClick={() => window.location.reload()}>
                        Réessayer
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box textAlign="center" mb={6}>
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 3
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
                        bgcolor: 'success.main',
                        '&:hover': {
                            bgcolor: 'success.dark',
                        },
                        color: "white",
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: 3,
                        borderRadius: 2
                    }}
                >
                    Publier une entreprise à vendre
                </Button>
            </Box>

            {/* Search and Filter Section */}
            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    mb: 4,
                    backgroundColor: 'background.paper'
                }}
            >
                <Grid container spacing={3} sx={{ alignItems: "center" }}>
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
                    <Grid size={{ md: 3.5, sm: 6, xs: 12 }}>
                        <SelectField
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            label="Filtrer par ville"
                            options={locationOptions}
                            searchPlaceholder='Rechercher'
                            prefixIcon={<FaFilter />}
                        />
                    </Grid>

                    <Grid size={{ md: 3.5, sm: 6, xs: 12 }}>
                        <SelectField
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label="Filtrer par Category"
                            options={categoryOptions}
                            searchPlaceholder='Rechercher'
                            prefixIcon={<FaLayerGroup />}
                        />
                    </Grid>
                </Grid>

                {/* Results Summary */}
                {totalBusinesses > 0 && (
                    <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                            {totalBusinesses} entreprise{totalBusinesses > 1 ? 's' : ''} trouvée{totalBusinesses > 1 ? 's' : ''}
                            {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Business Listings */}
            <div id="business-listings">
                {businesses.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: 3 }}
                        >
                            {searchTerm || locationFilter || categoryFilter ?
                                'Aucune entreprise trouvée avec ces critères.' :
                                'Aucune entreprise publiée pour le moment.'
                            }
                        </Typography>
                        <Button
                            variant="text"
                            onClick={() => setShowForm(true)}
                            sx={{
                                color: 'success.main',
                                '&:hover': {
                                    color: 'success.dark',
                                    backgroundColor: 'success.light',
                                },
                                fontWeight: 500
                            }}
                        >
                            Soyez le premier à publier une annonce !
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {businesses.map((business) => (
                                <Grid size={{ md: 4, sm: 6, xs: 12 }} key={business.id}>
                                    <BusinessCard
                                        business={business}
                                        onClick={() => handleBusinessClick(business.slug)}
                                        showDetailsButton={true}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'background.paper',
                                        borderRadius: 2
                                    }}
                                >
                                    <Stack spacing={2} alignItems="center">
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
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'success.main',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: 'success.dark',
                                                        },
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'success.light',
                                                        color: 'success.dark',
                                                    },
                                                },
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Affichage de {meta.from || 0}-{meta.to || 0} sur {totalBusinesses} entreprises
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Box>
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
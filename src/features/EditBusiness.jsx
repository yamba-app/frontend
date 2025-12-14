import { useCallback, useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    Alert,
    Container,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { FaPaperPlane, FaSave } from 'react-icons/fa';
import useToast from '../components/Toast.components';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    useAdminBusiness, 
    useDeletePhoto, 
    useDeleteVideo, 
    useUpdateBusiness 
} from './services/Feature.services';
import { businessValidator } from '../utils/functions/inputValidations.functions';
import ContactSection from '../pages/sections/Contact.sections';
import BasicInfoSection from '../pages/sections/Info.section';
import FinancialInfoSection from '../pages/sections/Financial.sections';
import AssetsAvantageSections from '../pages/sections/Avantage.section';
import MediaSection from '../pages/sections/Media.sections';

const EditBusiness = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();
    
    // State management
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        location: '',
        fullAddress: '',
        description: '',
        additionalInfo: '',
        price: '',
        yearEstablished: '',
        employees: '',
        monthlyRevenue: '',
        yearlyRevenue: '',
        assets: [],
        newAsset: '',
        advantages: [],
        newAdvantage: '',
        reasons: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        photos: [],
        videos: [],
        existingPhotos: [],
        existingVideos: [],
    });

    const [errors, setErrors] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    
    const validationSchema = businessValidator();

    // React Query hooks
    const { data: business, isLoading: isFetching, isError, error: fetchError } = useAdminBusiness(id);
    const updateBusinessMutation = useUpdateBusiness(id);
    const deletePhotoMutation = useDeletePhoto(id);
    const deleteVideoMutation = useDeleteVideo(id);

    // Populate form when business data is loaded
    useEffect(() => {
        if (business) {
            const initialData = {
                name: business.name || '',
                category: business.category || '',
                location: business.location || '',
                fullAddress: business.fullAddress || '',
                description: business.description || '',
                additionalInfo: business.additionalInfo || '',
                price: business.price ? formatCurrency(business.price.toString()) : '',
                yearEstablished: business.yearEstablished?.toString() || '',
                employees: business.employees?.toString() || '',
                monthlyRevenue: business.monthlyRevenue ? formatCurrency(business.monthlyRevenue.toString()) : '',
                yearlyRevenue: business.yearlyRevenue ? formatCurrency(business.yearlyRevenue.toString()) : '',
                assets: business.assets || [],
                newAsset: '',
                advantages: business.advantages || [],
                newAdvantage: '',
                reasons: business.reasons || '',
                contactName: business.contactName || business.submitterName || '',
                contactPhone: business.contactPhone || business.submitterPhone || '',
                contactEmail: business.contactEmail || business.submitterEmail || '',
                photos: [],
                videos: [],
                existingPhotos: business.photos || [],
                existingVideos: business.videos || [],
            };
            setFormData(initialData);
            setHasUnsavedChanges(false);
        }
    }, [business]);

    // Handle update success
    useEffect(() => {
        if (updateBusinessMutation.isSuccess) {
            // Cleanup preview URLs
            cleanupMediaPreviews();

            showToast({
                title: "Succès",
                description: "Entreprise mise à jour avec succès !",
                status: "success"
            });

            setHasUnsavedChanges(false);

            setTimeout(() => {
                navigate('/admin/businesses');
            }, 1500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateBusinessMutation, navigate, showToast]);

    // Handle update error
    useEffect(() => {
        if (updateBusinessMutation.isError) {
            const error = updateBusinessMutation.error;
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                scrollToFirstError(error.response.data.errors);
            } else {
                showToast({
                    title: "Erreur",
                    description: error.response?.data?.message || "Échec de la mise à jour",
                    status: "error"
                });
            }
        }
    }, [updateBusinessMutation.isError, updateBusinessMutation.error, showToast]);

    // Handle photo deletion
    useEffect(() => {
        if (deletePhotoMutation.isSuccess) {
            const deletedPhotoUrl = deletePhotoMutation.variables;
            setFormData(prev => ({
                ...prev,
                existingPhotos: prev.existingPhotos.filter(p => p !== deletedPhotoUrl)
            }));
            setHasUnsavedChanges(true);
            showToast({
                title: "Succès",
                description: "Photo supprimée avec succès",
                status: "success"
            });
        }

        if (deletePhotoMutation.isError) {
            showToast({
                title: "Erreur",
                description: deletePhotoMutation.error.response?.data?.message || "Impossible de supprimer la photo",
                status: "error"
            });
        }
    }, [deletePhotoMutation, deletePhotoMutation.isError, deletePhotoMutation.variables, showToast]);

    // Handle video deletion
    useEffect(() => {
        if (deleteVideoMutation.isSuccess) {
            const deletedVideoUrl = deleteVideoMutation.variables;
            setFormData(prev => ({
                ...prev,
                existingVideos: prev.existingVideos.filter(v => v !== deletedVideoUrl)
            }));
            setHasUnsavedChanges(true);
            showToast({
                title: "Succès",
                description: "Vidéo supprimée avec succès",
                status: "success"
            });
        }

        if (deleteVideoMutation.isError) {
            showToast({
                title: "Erreur",
                description: deleteVideoMutation.error.response?.data?.message || "Impossible de supprimer la vidéo",
                status: "error"
            });
        }
    }, [deleteVideoMutation, deleteVideoMutation.isError, deleteVideoMutation.variables, showToast]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Helper functions
    const formatCurrency = (value) => {
        const number = value.replace(/[^0-9]/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const cleanupMediaPreviews = () => {
        formData.photos.forEach(photo => {
            if (photo.preview) {
                URL.revokeObjectURL(photo.preview);
            }
        });
        formData.videos.forEach(video => {
            if (video.preview) {
                URL.revokeObjectURL(video.preview);
            }
        });
    };

    const scrollToFirstError = (validationErrors) => {
        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
        }
    };

    // Event handlers
    const handleChange = useCallback((event) => {
        const { name, type, value, checked } = event.target;
        const sanitizedValue = type === "checkbox" ? checked : DOMPurify.sanitize(value);
        
        setFormData((prevValues) => ({
            ...prevValues,
            [name]: sanitizedValue
        }));
        
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
        
        setHasUnsavedChanges(true);
    }, []);

    const handleCurrencyChange = useCallback((e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        const formatted = formatCurrency(sanitizedValue);
        
        setFormData(prev => ({ ...prev, [name]: formatted }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
        
        setHasUnsavedChanges(true);
    }, []);

    const handleNavigation = (path) => {
        if (hasUnsavedChanges) {
            setPendingNavigation(path);
            setShowExitDialog(true);
        } else {
            navigate(path);
        }
    };

    const confirmNavigation = () => {
        cleanupMediaPreviews();
        setShowExitDialog(false);
        if (pendingNavigation) {
            navigate(pendingNavigation);
        }
    };

    const cancelNavigation = () => {
        setShowExitDialog(false);
        setPendingNavigation(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            // Prepare data for validation
            const dataToValidate = {
                ...formData,
                price: formData.price ? parseInt(formData.price.replace(/[^0-9]/g, '')) : null,
                yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
                employees: formData.employees ? parseInt(formData.employees) : null,
                monthlyRevenue: formData.monthlyRevenue ? parseInt(formData.monthlyRevenue.replace(/[^0-9]/g, '')) : null,
                yearlyRevenue: formData.yearlyRevenue ? parseInt(formData.yearlyRevenue.replace(/[^0-9]/g, '')) : null,
            };

            // Client-side validation
            await validationSchema.validate(dataToValidate, { abortEarly: false });

            // Create FormData
            const formDataToSend = new FormData();

            // Add _method for Laravel to treat this as PUT
            formDataToSend.append('_method', 'PUT');

            // Basic fields
            const fieldMappings = {
                'submitter_name': formData.contactName,
                'submitter_email': formData.contactEmail,
                'submitter_phone': formData.contactPhone,
                'name': formData.name,
                'category': formData.category,
                'location': formData.location,
                'full_address': formData.fullAddress,
                'description': formData.description,
                'additional_info': formData.additionalInfo || '',
                'price': parseInt(formData.price.replace(/[^0-9]/g, '')),
                'reasons': formData.reasons || '',
                'contact_name': formData.contactName,
                'contact_phone': formData.contactPhone,
                'contact_email': formData.contactEmail,
            };

            Object.entries(fieldMappings).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Optional numeric fields
            const optionalFields = [
                { key: 'year_established', value: formData.yearEstablished },
                { key: 'employees', value: formData.employees },
                { key: 'monthly_revenue', value: formData.monthlyRevenue },
                { key: 'yearly_revenue', value: formData.yearlyRevenue },
            ];

            optionalFields.forEach(({ key, value }) => {
                if (value) {
                    const numericValue = key.includes('revenue') || key === 'price'
                        ? parseInt(value.replace(/[^0-9]/g, ''))
                        : parseInt(value);
                    formDataToSend.append(key, numericValue);
                }
            });

            // Arrays
            formDataToSend.append('assets', JSON.stringify(formData.assets));
            formDataToSend.append('advantages', JSON.stringify(formData.advantages));

            // New Photos
            if (formData.photos?.length > 0) {
                formData.photos.forEach((photoObj) => {
                    if (photoObj.file instanceof File) {
                        formDataToSend.append('photos[]', photoObj.file);
                    }
                });
            }

            // New Videos
            if (formData.videos?.length > 0) {
                formData.videos.forEach((videoObj) => {
                    if (videoObj.file instanceof File) {
                        formDataToSend.append('videos[]', videoObj.file);
                    }
                });
            }

            // Trigger mutation
            updateBusinessMutation.mutate(formDataToSend);

        } catch (error) {
            if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
                scrollToFirstError(validationErrors);
            }else if (error.response?.data?.errors) {
            // MAP BACKEND ERRORS TO FRONTEND FIELD NAMES
            const backendErrors = error.response.data.errors;
            const mappedErrors = {};
            
            const fieldMapping = {
                'full_address': 'fullAddress',
                'additional_info': 'additionalInfo',
                'year_established': 'yearEstablished',
                'monthly_revenue': 'monthlyRevenue',
                'yearly_revenue': 'yearlyRevenue',
                'contact_name': 'contactName',
                'contact_phone': 'contactPhone',
                'contact_email': 'contactEmail',
                'submitter_name': 'contactName',
                'submitter_email': 'contactEmail',
                'submitter_phone': 'contactPhone',
            };
            
            Object.entries(backendErrors).forEach(([backendKey, errorMessage]) => {
                const frontendKey = fieldMapping[backendKey] || backendKey;
                mappedErrors[frontendKey] = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
            });
            
            setErrors(mappedErrors);
            scrollToFirstError(mappedErrors);
        }
            else {
                showToast({
                    title: "Erreur",
                    description: error.message || "Une erreur s'est produite",
                    status: "error"
                });
            }
        }
    };

    // Loading state
    if (isFetching) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Chargement des données...
                </Typography>
            </Container>
        );
    }

    // Error state
    if (isError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Impossible de charger les données de l'entreprise
                    </Typography>
                    <Typography variant="body2">
                        {fetchError?.response?.data?.message || "Une erreur s'est produite"}
                    </Typography>
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/admin/businesses')}
                    sx={{ mt: 2 }}
                >
                    Retour à la liste
                </Button>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header Alert */}
                <Alert 
                    severity={hasUnsavedChanges ? "warning" : "info"} 
                    sx={{ mb: 3 }}
                >
                    <Typography variant="body2">
                        <strong>Mode édition:</strong> Modifiez les informations de l'entreprise ci-dessous.
                        {hasUnsavedChanges && " (Modifications non enregistrées)"}
                    </Typography>
                </Alert>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <ContactSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />
                    <BasicInfoSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />
                    <FinancialInfoSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                        handleCurrencyChange={handleCurrencyChange}
                    />
                    <AssetsAvantageSections
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        setErrors={setErrors}
                    />
                    <MediaSection
                        formData={formData}
                        setFormData={setFormData}
                        setErrors={setErrors}
                        existingPhotos={formData.existingPhotos}
                        existingVideos={formData.existingVideos}
                        onDeleteExistingPhoto={(photoUrl) => deletePhotoMutation.mutate(photoUrl)}
                        onDeleteExistingVideo={(videoUrl) => deleteVideoMutation.mutate(videoUrl)}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                    />

                    {/* Action Buttons */}
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => handleNavigation('/admin/businesses')}
                            sx={{ minWidth: 150 }}
                            disabled={updateBusinessMutation.isLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={updateBusinessMutation.isLoading || !hasUnsavedChanges}
                            startIcon={
                                updateBusinessMutation.isLoading 
                                    ? <CircularProgress size={20} /> 
                                    : <FaSave />
                            }
                            sx={{
                                flex: 1,
                                minWidth: 200,
                                borderRadius: 25,
                                background: 'linear-gradient(45deg, #28a745, #20c997)',
                                textTransform: 'none',
                                fontWeight: 700,
                                color: 'white',
                                fontSize: '1.1rem',
                                py: 1.5,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #218838, #1ea080)',
                                },
                                '&:disabled': {
                                    background: '#ccc',
                                    color: '#666',
                                },
                            }}
                        >
                            {updateBusinessMutation.isLoading 
                                ? 'Mise à jour en cours...' 
                                : 'Enregistrer les modifications'}
                        </Button>
                    </Box>
                </Box>
            </Container>

            {/* Exit Confirmation Dialog */}
            <Dialog
                open={showExitDialog}
                onClose={cancelNavigation}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Modifications non enregistrées
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter sans enregistrer ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelNavigation} color="primary">
                        Continuer l'édition
                    </Button>
                    <Button onClick={confirmNavigation} color="error" variant="contained">
                        Quitter sans enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {ToastComponent}
        </>
    );
};

export default EditBusiness;
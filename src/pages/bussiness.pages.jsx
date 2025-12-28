import { useCallback, useState } from 'react';
import {
    Button,
    Typography,
    Box,
    Alert,
    Container,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link,
} from '@mui/material';
import DOMPurify from 'dompurify';
import BasicInfoSection from './sections/Info.section';
import FinancialInfoSection from './sections/Financial.sections';
import AssetsAvantageSections from './sections/Avantage.section';
import MediaSection from './sections/Media.sections';
import ContactSection from './sections/Contact.sections';
import { businessValidator } from '../utils/functions/inputValidations.functions';
import { FaPaperPlane } from 'react-icons/fa';
import { axiosPrivate } from '../core/instance/axios.instance';
import { fetchCsrfToken } from '../core/token/csrf.token';
import useToast from '../components/Toast.components';
import { pagesRoutes } from '../constants/routes.constans';

const BusinessFormPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'COMMERCE',
        location: '',
        full_address: '',
        description: '',
        additional_info: '',
        price: '',
        year_established: '2023',
        employees: '',
        monthly_revenue: '',
        yearly_revenue: '',
        assets: [],
        newAsset: '',
        advantages: [],
        newAdvantage: '',
        reasons: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        photos: [],
        videos: [],
        acceptedTerms: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showTermsDialog, setShowTermsDialog] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const validationSchema = businessValidator();

    const handleChange = useCallback((event) => {
        const { name, type, value, checked } = event.target;
        const sanitizedValue = type === "checkbox" ? checked : DOMPurify.sanitize(value);
        
        // Show confirmation dialog when checking terms
        if (name === 'acceptedTerms' && checked) {
            setShowTermsDialog(true);
            return;
        }
        
        setFormData((prevValues) => ({
            ...prevValues,
            [name]: sanitizedValue
        }));
        
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
    }, []);

    const formatCurrency = (value) => {
        const number = value.replace(/[^0-9]/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        const formatted = formatCurrency(sanitizedValue);
        
        setFormData(prev => ({ ...prev, [name]: formatted }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
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

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'COMMERCE',
            location: '',
            full_address: '',
            description: '',
            additional_info: '',
            price: '',
            year_established: '2023',
            employees: '',
            monthly_revenue: '',
            yearly_revenue: '',
            assets: [],
            newAsset: '',
            advantages: [],
            newAdvantage: '',
            reasons: '',
            contact_name: '',
            contact_phone: '',
            contact_email: '',
            photos: [],
            videos: [],
            acceptedTerms: false
        });
    };

    const scrollToFirstError = (errorFields) => {
        const firstErrorField = Object.keys(errorFields)[0];
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const prepareFormDataForSubmission = () => {
        const formDataToSend = new FormData();

        // Submitter info (same as contact)
        formDataToSend.append('submitter_name', formData.contact_name);
        formDataToSend.append('submitter_email', formData.contact_email);
        formDataToSend.append('submitter_phone', formData.contact_phone || '');

        // Business basic info
        formDataToSend.append('name', formData.name);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('full_address', formData.full_address || '');
        formDataToSend.append('description', formData.description);
        formDataToSend.append('additional_info', formData.additional_info || '');

        // Financial info - required
        formDataToSend.append('price', parseInt(formData.price.replace(/[^0-9]/g, '')));
        formDataToSend.append('year_established', parseInt(formData.year_established));
        formDataToSend.append('employees', parseInt(formData.employees));

        // Financial info - optional
        if (formData.monthly_revenue) {
            formDataToSend.append('monthly_revenue', parseInt(formData.monthly_revenue.replace(/[^0-9]/g, '')));
        }
        if (formData.yearly_revenue) {
            formDataToSend.append('yearly_revenue', parseInt(formData.yearly_revenue.replace(/[^0-9]/g, '')));
        }

        // Arrays as JSON
        formDataToSend.append('assets', JSON.stringify(formData.assets));
        formDataToSend.append('advantages', JSON.stringify(formData.advantages));
        
        // Reasons for selling
        if (formData.reasons) {
            formDataToSend.append('reasons', formData.reasons);
        }

        // Contact info
        formDataToSend.append('contact_name', formData.contact_name);
        formDataToSend.append('contact_phone', formData.contact_phone);
        formDataToSend.append('contact_email', formData.contact_email);

        // Photos
        if (formData.photos?.length > 0) {
            formData.photos.forEach((photoObj, index) => {
                const fileToUpload = photoObj instanceof File ? photoObj : photoObj.file;
                
                if (fileToUpload instanceof File) {
                    formDataToSend.append('photos[]', fileToUpload);
                } else {
                    console.warn(`Photo at index ${index} is not a valid File object`, photoObj);
                }
            });
        }

        // Videos
        if (formData.videos?.length > 0) {
            formData.videos.forEach((videoObj, index) => {
                const fileToUpload = videoObj instanceof File ? videoObj : videoObj.file;
                
                if (fileToUpload instanceof File) {
                    formDataToSend.append('videos[]', fileToUpload);
                } else {
                    console.warn(`Video at index ${index} is not a valid File object`, videoObj);
                }
            });
        }

        return formDataToSend;
    };

    const handleValidationError = (error) => {
        if (error.inner) {
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);

            showToast({
                title: "Erreur de validation",
                description: "Veuillez vérifier tous les champs requis",
                status: "error"
            });

            scrollToFirstError(validationErrors);
        }
    };

    const handleBackendError = (error) => {
        if (error.response?.status === 422 && error.response?.data?.errors) {
            const backendErrors = error.response.data.errors;
            setErrors(backendErrors);
            
            showToast({
                title: "Erreur de validation",
                description: "Veuillez vérifier les champs du formulaire",
                status: "error"
            });

            scrollToFirstError(backendErrors);
        } else if (error.response?.data?.message) {
            showToast({
                title: "Erreur",
                description: error.response.data.message,
                status: "error"
            });
        } else {
            showToast({
                title: "Erreur",
                description: error.message || "Une erreur s'est produite lors de la soumission",
                status: "error"
            });
        }
    };

    const handleAcceptTerms = () => {
        setFormData((prevValues) => ({
            ...prevValues,
            acceptedTerms: true
        }));
        setShowTermsDialog(false);
        
        showToast({
            title: "Conditions acceptées",
            description: "Vous avez accepté les conditions générales. Vous pouvez maintenant soumettre votre entreprise.",
            status: "success"
        });
    };

    const handleDeclineTerms = () => {
        setFormData((prevValues) => ({
            ...prevValues,
            acceptedTerms: false
        }));
        setShowTermsDialog(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Prepare data for validation
            const dataToValidate = {
                ...formData,
                price: formData.price ? parseInt(formData.price.replace(/[^0-9]/g, '')) : null,
                year_established: formData.year_established ? parseInt(formData.year_established) : null,
                employees: formData.employees ? parseInt(formData.employees) : null,
                monthly_revenue: formData.monthly_revenue ? parseInt(formData.monthly_revenue.replace(/[^0-9]/g, '')) : null,
                yearly_revenue: formData.yearly_revenue ? parseInt(formData.yearly_revenue.replace(/[^0-9]/g, '')) : null,
            };

            // Client-side validation
            await validationSchema.validate(dataToValidate, { abortEarly: false });

            // Prepare form data
            const formDataToSend = prepareFormDataForSubmission();

            // Fetch CSRF token
            await fetchCsrfToken();

            // Submit form
            const response = await axiosPrivate.post('/api/business/submit', formDataToSend, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Success handling
            if (response.status === 201) {
                showToast({
                    title: "Succès",
                    description: response.data.message || "Entreprise soumise avec succès !",
                    status: "success"
                });

                // Clean up and reset
                cleanupMediaPreviews();
                resetForm();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error) {
            console.error('Submission error:', error);
            
            if (error.inner) {
                handleValidationError(error);
            } else {
                handleBackendError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Note:</strong> Votre annonce sera examinée par notre équipe avant d'être publiée sur la plateforme.
                </Typography>
            </Alert>

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
                />

                <Box sx={{ mt: 3, mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="acceptedTerms"
                                checked={formData.acceptedTerms}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body2">
                                J'accepte les{' '}
                                <Link href={pagesRoutes.termeCondition} target="_blank" sx={{ color: '#28a745', fontWeight: 600 }}>
                                    Conditions Générales
                                </Link>
                                , le{' '}
                                <Link href={pagesRoutes.disclaimer} target="_blank" sx={{ color: '#dc3545', fontWeight: 600 }}>
                                    Disclaimer Légal
                                </Link>
                                {' '}et la{' '}
                                <Link href={pagesRoutes.privacy} target="_blank" sx={{ color: '#2196f3', fontWeight: 600 }}>
                                    Politique de Confidentialité
                                </Link>
                                {' '}*
                            </Typography>
                        }
                    />
                    {errors.acceptedTerms && (
                        <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                            {errors.acceptedTerms}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading || !formData.acceptedTerms}
                        startIcon={isLoading ? <CircularProgress size={20} /> : <FaPaperPlane />}
                        sx={{
                            minWidth: 200,
                            borderRadius: 25,
                            width: '100%',
                            background: 'linear-gradient(45deg, #28a745, #20c997)',
                            textTransform: 'none',
                            fontWeight: 700,
                            color: 'white',
                            fontSize: '1.1rem',
                            py: 1.5,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #218838, #1ea080)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)',
                            },
                            '&:disabled': {
                                background: 'linear-gradient(45deg, #cccccc, #999999)',
                                color: 'white',
                                transform: 'none',
                                boxShadow: 'none',
                            }
                        }}
                    >
                        {isLoading ? 'Envoi en cours...' : 'Soumettre l\'entreprise'}
                    </Button>
                </Box>
            </Box>
            
            {/* Terms Confirmation Dialog */}
            <Dialog
                open={showTermsDialog}
                onClose={handleDeclineTerms}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(45deg, #28a745, #20c997)',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    Confirmation des conditions
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1">
                        En acceptant, vous confirmez avoir lu et accepté :
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body2">
                            Les <Typography component="span" sx={{ fontWeight: 600, color: '#28a745' }}>Conditions Générales d'Utilisation</Typography> : rôle de la plateforme, services proposés et vos responsabilités
                        </Typography>
                        <Typography component="li" variant="body2">
                            Le <Typography component="span" sx={{ fontWeight: 600, color: '#dc3545' }}>Disclaimer Légal</Typography> : absence de garantie sur les annonces et obligation de vérification
                        </Typography>
                        <Typography component="li" variant="body2">
                            La <Typography component="span" sx={{ fontWeight: 600, color: '#2196f3' }}>Politique de Confidentialité</Typography> : protection de vos données conformément à la Loi 010 2021/AN
                        </Typography>
                    </Box>
                    
                    <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ⚠️ Important
                        </Typography>
                        <Typography variant="body2">
                            Vous garantissez que toutes les informations fournies sont exactes et que vous êtes le propriétaire légal ou le représentant autorisé de l'entreprise.
                        </Typography>
                    </Alert>

                    <Alert severity="info">
                        <Typography variant="body2">
                            Votre annonce sera examinée par notre équipe avant publication. Toute fausse déclaration peut entraîner son rejet et la suspension de votre compte.
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button 
                        onClick={handleDeclineTerms}
                        variant="outlined"
                        color="error"
                    >
                        Refuser
                    </Button>
                    <Button 
                        onClick={handleAcceptTerms}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #28a745, #20c997)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #218838, #1ea080)',
                            }
                        }}
                    >
                        J'ai lu et j'accepte
                    </Button>
                </DialogActions>
            </Dialog>
            
            {ToastComponent}
        </Container>
    );
};

export default BusinessFormPage;
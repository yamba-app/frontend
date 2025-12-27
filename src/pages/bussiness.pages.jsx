import { useCallback, useState } from 'react';
import {
    Button,
    Typography,
    Box,
    Alert,
    Container,
    CircularProgress,
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
        videos: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { showToast, ToastComponent } = useToast();

    const validationSchema = businessValidator();

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

            // Client-side validation with Yup
            await validationSchema.validate(dataToValidate, { abortEarly: false });

            // Create FormData for file uploads
            const formDataToSend = new FormData();

            // FIXED: Use contact info as submitter info (same person)
            formDataToSend.append('submitter_name', formData.contact_name);
            formDataToSend.append('submitter_email', formData.contact_email);
            formDataToSend.append('submitter_phone', formData.contact_phone || '');

            // Business Info
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('full_address', formData.full_address || '');
            formDataToSend.append('description', formData.description);
            formDataToSend.append('additional_info', formData.additional_info || '');

            // Financial - Required fields
            formDataToSend.append('price', parseInt(formData.price.replace(/[^0-9]/g, '')));
            formDataToSend.append('year_established', parseInt(formData.year_established));
            formDataToSend.append('employees', parseInt(formData.employees));

            // Optional financial fields
            if (formData.monthly_revenue) {
                formDataToSend.append('monthly_revenue', parseInt(formData.monthly_revenue.replace(/[^0-9]/g, '')));
            }
            if (formData.yearly_revenue) {
                formDataToSend.append('yearly_revenue', parseInt(formData.yearly_revenue.replace(/[^0-9]/g, '')));
            }

            // Arrays (convert to JSON strings)
            formDataToSend.append('assets', JSON.stringify(formData.assets));
            formDataToSend.append('advantages', JSON.stringify(formData.advantages));
            
            // Reasons for selling
            if (formData.reasons) {
                formDataToSend.append('reasons', formData.reasons);
            }

            // Business Contact (same as submitter in this case)
            formDataToSend.append('contact_name', formData.contact_name);
            formDataToSend.append('contact_phone', formData.contact_phone);
            formDataToSend.append('contact_email', formData.contact_email);

            // Photos - Extract File objects
            if (formData.photos && formData.photos.length > 0) {
                formData.photos.forEach((photoObj, index) => {
                    const fileToUpload = photoObj instanceof File ? photoObj : photoObj.file;
                    
                    if (fileToUpload instanceof File) {
                        formDataToSend.append('photos[]', fileToUpload);
                    } else {
                        console.warn(`Photo at index ${index} is not a valid File object`, photoObj);
                    }
                });
            }

            // Videos - Extract File objects
            if (formData.videos && formData.videos.length > 0) {
                formData.videos.forEach((videoObj, index) => {
                    const fileToUpload = videoObj instanceof File ? videoObj : videoObj.file;
                    
                    if (fileToUpload instanceof File) {
                        formDataToSend.append('videos[]', fileToUpload);
                    } else {
                        console.warn(`Video at index ${index} is not a valid File object`, videoObj);
                    }
                });
            }

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

                // Clean up preview URLs to prevent memory leaks
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

                // Reset form
                setFormData({
                    name: '',
                    category: '',
                    location: '',
                    full_address: '',
                    description: '',
                    additional_info: '',
                    price: '',
                    year_established: '',
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
                    videos: []
                });

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error) {
            console.error('Submission error:', error);

            // Handle validation errors from backend
            if (error.response?.status === 422 && error.response?.data?.errors) {
                const backendErrors = error.response.data.errors;
                setErrors(backendErrors);
                
                showToast({
                    title: "Erreur de validation",
                    description: "Veuillez vérifier les champs du formulaire",
                    status: "error"
                });

                // Scroll to first error
                const firstErrorField = Object.keys(backendErrors)[0];
                const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            // Handle Yup validation errors
            else if (error.inner) {
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

                // Scroll to first error
                const firstErrorField = document.querySelector('[name="' + Object.keys(validationErrors)[0] + '"]');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            // Handle general errors
            else if (error.response?.data?.message) {
                showToast({
                    title: "Erreur",
                    description: error.response.data.message,
                    status: "error"
                });
            }
            // Network or unknown errors
            else {
                showToast({
                    title: "Erreur",
                    description: error.message || "Une erreur s'est produite lors de la soumission",
                    status: "error"
                });
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

                <Box sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
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
                            '&:hover': {
                                background: 'linear-gradient(45deg, #218838, #1ea080)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)',
                            },
                            '&:disabled': {
                                background: 'linear-gradient(45deg, #cccccc, #999999)',
                                color: 'white',
                            }
                        }}
                    >
                        {isLoading ? 'Envoi en cours...' : 'Soumettre l\'entreprise'}
                    </Button>
                </Box>
            </Box>
            {ToastComponent}
        </Container>
    );
};

export default BusinessFormPage;
import { useCallback, useState } from 'react';
import {
    Button,
    Typography,
    Box,
    Alert,
    Container,
    CircularProgress,
    Snackbar
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

// API Configuration

const BusinessFormPage = () => {
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
        videos: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { showToast, ToastComponent } = useToast();

    // Yup validation schema
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
                yearEstablished: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
                employees: formData.employees ? parseInt(formData.employees) : null,
                monthlyRevenue: formData.monthlyRevenue ? parseInt(formData.monthlyRevenue.replace(/[^0-9]/g, '')) : null,
                yearlyRevenue: formData.yearlyRevenue ? parseInt(formData.yearlyRevenue.replace(/[^0-9]/g, '')) : null,
            };

            // Client-side validation with Yup
            await validationSchema.validate(dataToValidate, { abortEarly: false });

            // Create FormData for file uploads
            const formDataToSend = new FormData();

            // Submitter Info
            formDataToSend.append('submitter_name', formData.contactName);
            formDataToSend.append('submitter_email', formData.contactEmail);
            formDataToSend.append('submitter_phone', formData.contactPhone);

            // Business Info
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('full_address', formData.fullAddress);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('additional_info', formData.additionalInfo || '');

            // Financial
            formDataToSend.append('price', parseInt(formData.price.replace(/[^0-9]/g, '')));

            if (formData.yearEstablished) {
                formDataToSend.append('year_established', parseInt(formData.yearEstablished));
            }
            if (formData.employees) {
                formDataToSend.append('employees', parseInt(formData.employees));
            }
            if (formData.monthlyRevenue) {
                formDataToSend.append('monthly_revenue', parseInt(formData.monthlyRevenue.replace(/[^0-9]/g, '')));
            }
            if (formData.yearlyRevenue) {
                formDataToSend.append('yearly_revenue', parseInt(formData.yearlyRevenue.replace(/[^0-9]/g, '')));
            }

            // Arrays (convert to JSON strings)
            formDataToSend.append('assets', JSON.stringify(formData.assets));
            formDataToSend.append('advantages', JSON.stringify(formData.advantages));
            formDataToSend.append('reasons', formData.reasons || '');

            // Business Contact
            formDataToSend.append('contact_name', formData.contactName);
            formDataToSend.append('contact_phone', formData.contactPhone);
            formDataToSend.append('contact_email', formData.contactEmail);

            // Photos - FIXED: Extract the actual File object from each photo
            if (formData.photos && formData.photos.length > 0) {
                formData.photos.forEach((photoObj) => {
                    if (photoObj.file instanceof File) {
                        formDataToSend.append('photos[]', photoObj.file);
                    }
                });
            }

            // Videos - FIXED: Extract the actual File object from each video
            if (formData.videos && formData.videos.length > 0) {
                formData.videos.forEach((videoObj) => {
                    if (videoObj.file instanceof File) {
                        formDataToSend.append('videos[]', videoObj.file);
                    }
                });
            }

          
            await fetchCsrfToken();

            const response = await axiosPrivate.post('/api/busines/submit', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Show success message
            if (response.status === 201) {
                showToast({
                    title: "",
                    description: "Entreprise soumise avec succès !",
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
                    videos: []
                });
            }

        } catch (error) {
            if (error.response && error.response.data.message) {
                showToast({
                    title: "",
                    description: error.response.data.message,
                    status: "error"
                });
            } else if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);

                // Scroll to first error
                const firstErrorField = document.querySelector('[name="' + Object.keys(validationErrors)[0] + '"]');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                showToast({
                    title: "",
                    description: error.message || "Une erreur s'est produite",
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
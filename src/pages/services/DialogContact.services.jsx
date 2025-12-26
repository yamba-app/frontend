// src/components/InquiryDialog.jsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    IconButton,
    Alert,
    Avatar,
    InputAdornment,
    CircularProgress,
    Fade,
    Slide
} from '@mui/material';
import {
    MdClose as CloseIcon,
    MdSend as SendIcon,
    MdPerson as PersonIcon,
    MdPhone as PhoneIcon,
    MdEmail as EmailIcon,
    MdMessage as MessageIcon,
    MdBusiness as BusinessIcon,
    MdLocationOn as LocationIcon,
    MdAttachMoney as MoneyIcon,
    MdCheckCircle as CheckCircleIcon
} from 'react-icons/md';
import DOMPurify from 'dompurify';
import { inquiryValidator } from '../../utils/functions/inputValidations.functions';
import { InputField, TextArea } from '../../components/Form.components';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Common Inquiry Dialog Component
 * Reusable dialog for sending inquiries about businesses
 */
export function InquiryDialog({
    open,
    onClose,
    business,
    onSubmit,
    isSubmitting = false
}) {
    const inquirySchema = inquiryValidator();
    
    const [formData, setFormData] = useState({
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = async () => {
        try {
            await inquirySchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (error) {
            if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        const payload = {
            ...formData,
            business_id: business.id
        };

        try {
            await onSubmit(payload);
            setSubmitSuccess(true);

            // Reset form after 2 seconds
            setTimeout(() => {
                setFormData({
                    sender_name: '',
                    sender_email: '',
                    sender_phone: '',
                    message: ''
                });
                setErrors({});
                setSubmitSuccess(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Submission error in dialog:', error);
            
            // Handle API validation errors
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !submitSuccess) {
            setFormData({
                sender_name: '',
                sender_email: '',
                sender_phone: '',
                message: ''
            });
            setErrors({});
            setSubmitSuccess(false);
            onClose();
        }
    };

    if (!business) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(46, 125, 50, 0.2)',
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2.5,
                    px: 3
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 48,
                            height: 48
                        }}
                    >
                        <SendIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            Demande de renseignements
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            Contactez le vendeur pour plus d'informations
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={handleClose}
                    disabled={isSubmitting || submitSuccess}
                    sx={{
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {/* Success Message */}
                <Fade in={submitSuccess}>
                    <Box sx={{ p: 3, display: submitSuccess ? 'block' : 'none' }}>
                        <Alert
                            severity="success"
                            icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
                            sx={{
                                borderRadius: 2,
                                py: 2,
                                '& .MuiAlert-icon': { fontSize: 32 },
                                border: '2px solid',
                                borderColor: 'success.main',
                                bgcolor: 'success.light'
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Message envoyé avec succès ! 🎉
                            </Typography>
                            <Typography variant="body2">
                                Le propriétaire vous contactera bientôt. Merci pour votre intérêt !
                            </Typography>
                        </Alert>
                    </Box>
                </Fade>

                {!submitSuccess && (
                    <>
                        {/* Business Info Card */}
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: 'success.light',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(46, 125, 50, 0.04) 100%)'
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'success.main',
                                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                                    }}
                                >
                                    <BusinessIcon sx={{ fontSize: 36 }} />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 0.5,
                                            color: 'success.dark'
                                        }}
                                    >
                                        {business.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {business.location}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <BusinessIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {business.business_number || business.businessNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 2,
                                            py: 0.75,
                                            bgcolor: 'white',
                                            borderRadius: 1.5,
                                            border: '2px solid',
                                            borderColor: 'success.main',
                                            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.15)'
                                        }}
                                    >
                                        <MoneyIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'success.dark'
                                            }}
                                        >
                                            {formatPrice(business.price)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3, lineHeight: 1.6 }}
                            >
                                Remplissez le formulaire ci-dessous pour envoyer votre message au propriétaire de cette entreprise. Tous les champs marqués d'un <Box component="span" sx={{ color: 'error.main' }}>*</Box> sont obligatoires.
                            </Typography>

                            <Grid container spacing={2.5}>
                                {/* Name Field */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InputField
                                        fullWidth
                                        label="Nom complet"
                                        name="sender_name"
                                        value={formData.sender_name}
                                        onChange={handleChange}
                                        placeholder="Votre nom complet"
                                        error={!!errors.sender_name}
                                        errorMessage={errors.sender_name}
                                        isRequired={true}
                                        disabled={isSubmitting}
                                        prefix={<PersonIcon style={{ color: '#2e7d32' }} />}
    
                                    />
                                </Grid>

                                {/* Phone Field */}
                                <Grid size={{ xs: 12, sm: 6 }}  >
                                    <InputField
                                        fullWidth
                                        label="Téléphone"
                                        name="sender_phone"
                                        value={formData.sender_phone}
                                        onChange={handleChange}
                                        error={!!errors.sender_phone}
                                        inputType={'phone'}
                                    
                                        errorMessage={errors.sender_phone}
                                        placeholder="+226 70 XX XX XX"
                                        isRequired={true}
                                        disabled={isSubmitting}
                                        prefix={<PhoneIcon style={{ color: '#2e7d32' }} />}
                                       
                                       
                                    />
                                </Grid>

                                {/* Email Field */}
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <InputField
                                        fullWidth
                                        label="Adresse email"
                                        name="sender_email"
                                        type="email"
                                        placeholder=" Addresse email valide"
                                        value={formData.sender_email}
                                        onChange={handleChange}
                                        error={!!errors.sender_email}
                                        helperText={errors.sender_email}
                                        isRequired={true}
                                        disabled={isSubmitting}
                                        prefix={<EmailIcon style={{ color: '#2e7d32' }} />}
                                       
                                       
                            
                                       
                                    />
                                </Grid>

                                {/* Message Field */}
                                <Grid size={{ xs: 12 }}>
                                    <TextArea
                                        fullWidth
                                        label="Votre message"
                                        name="message"
                                    
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        error={!!errors.message}
                                        helperText={errors.message || `${formData.message.length}/2000 caractères`}
                                        isRequired={true}
                                        disabled={isSubmitting}
                                        placeholder="Bonjour, je suis intéressé par votre entreprise. Pourriez-vous me fournir plus d'informations sur..."
                                        
                                       
                                    />
                                </Grid>
                            </Grid>

                            {/* Privacy Notice */}
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    bgcolor: 'info.light',
                                    borderRadius: 1.5,
                                    border: '1px solid',
                                    borderColor: 'info.main'
                                }}
                            >
                                <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500 }}>
                                    🔒 <strong>Confidentialité:</strong> Vos informations seront partagées uniquement avec le propriétaire de cette entreprise pour qu'il puisse vous contacter directement.
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}
            </DialogContent>

            {/* Actions */}
            {!submitSuccess && (
                <DialogActions
                    sx={{
                        px: 3,
                        py: 2.5,
                        bgcolor: 'grey.50',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        gap: 1.5
                    }}
                >
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        variant="outlined"
                        size="large"
                        sx={{
                            minWidth: 120,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: 'grey.400',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'grey.600',
                                bgcolor: 'grey.100'
                            }
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{
                            minWidth: 180,
                            bgcolor: 'success.main',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                            '&:hover': {
                                bgcolor: 'success.dark',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)'
                            },
                            '&:disabled': {
                                bgcolor: 'grey.300'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
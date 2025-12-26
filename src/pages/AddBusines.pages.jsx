import { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Alert,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container,
    CircularProgress
} from '@mui/material';
import {
    MdAdd as PlusIcon,
    MdClose as CloseIcon,
    MdImage as ImageIcon,
    MdVideoLibrary as VideoIcon,
    MdExpandMore as ExpandMoreIcon,
    MdBusiness as BusinessIcon,
    MdAttachMoney as MoneyIcon,
    MdPeople as PeopleIcon,
    MdInfo as InfoIcon
} from 'react-icons/md';
import { InputField, SelectField, TextArea } from '../components/Form.components';
import { BiCalendar } from 'react-icons/bi';
import { FaBuilding, FaCity, FaLayerGroup, FaMap } from 'react-icons/fa';
import axios from 'axios';

const businessCategories = [
    { key: 'RESTAURANT', value: 'Restaurant' },
    { key: 'COMMERCE', value: 'Commerce' },
    { key: 'SERVICE', value: 'Service' },
    { key: 'PRODUCTION', value: 'Production' },
    { key: 'TRANSPORT', value: 'Transport' },
    { key: 'TECHNOLOGIE', value: 'Technologie' },
    { key: 'SANTE', value: 'Santé' },
    { key: 'EDUCATION', value: 'Éducation' },
    { key: 'AUTRE', value: 'Autre' }
];

const currentYear = new Date().getFullYear();

const years = Array.from({ length: 50 }, (_, i) => {
    const year = currentYear - i;
    return { key: year.toString(), value: year.toString() };
});

const BusinessFormPage = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
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
        submitter_name: '',
        submitter_phone: '',
        submitter_email: '',
        photoFiles: [], // Store actual File objects
        videoFiles: []  // Store actual File objects
    });

    const [photosPreviews, setPhotosPreviews] = useState([]);
    const [videosPreviews, setVideosPreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        const requiredFields = [
            'name', 'category', 'location', 'description', 'price',
            'year_established', 'employees', 'submitter_name',
            'submitter_phone', 'submitter_email'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Ce champ est obligatoire';
            }
        });

        if (formData.assets.length === 0) {
            newErrors.assets = 'Veuillez ajouter au moins un équipement/actif';
        }

        if (formData.advantages.length === 0) {
            newErrors.advantages = 'Veuillez ajouter au moins un avantage';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);

            try {
                // Create FormData for file uploads
                const submitData = new FormData();

                // Add text fields
                submitData.append('name', formData.name);
                submitData.append('category', formData.category);
                submitData.append('location', formData.location);
                submitData.append('full_address', formData.full_address);
                submitData.append('description', formData.description);
                submitData.append('additional_info', formData.additional_info);
                submitData.append('price', formData.price.replace(/[^0-9]/g, ''));
                submitData.append('year_established', formData.year_established);
                submitData.append('employees', formData.employees);
                submitData.append('monthly_revenue', formData.monthly_revenue.replace(/[^0-9]/g, '') || '0');
                submitData.append('yearly_revenue', formData.yearly_revenue.replace(/[^0-9]/g, '') || '0');
                submitData.append('reasons', formData.reasons);
                submitData.append('submitter_name', formData.submitter_name);
                submitData.append('submitter_phone', formData.submitter_phone);
                submitData.append('submitter_email', formData.submitter_email);

                // Add arrays as JSON strings
                submitData.append('assets', JSON.stringify(formData.assets));
                submitData.append('advantages', JSON.stringify(formData.advantages));

                // Add photo files
                formData.photoFiles.forEach((file, index) => {
                    submitData.append(`photos[${index}]`, file);
                });

                // Add video files
                formData.videoFiles.forEach((file, index) => {
                    submitData.append(`videos[${index}]`, file);
                });

                // Send to API
                const response = await axios.post('/api/busines/submit', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    alert('Votre entreprise a été soumise avec succès ! Elle sera examinée par notre équipe avant publication.');
                    resetForm();
                    if (onClose) onClose();
                    if (onSubmit) onSubmit(response.data.data);
                }
            } catch (error) {
                console.error('Submission error:', error);

                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    alert(error.response?.data?.message || 'Une erreur est survenue lors de la soumission');
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', category: '', location: '', full_address: '', description: '',
            additional_info: '', price: '', year_established: '', employees: '',
            monthly_revenue: '', yearly_revenue: '', assets: [], newAsset: '',
            advantages: [], newAdvantage: '', reasons: '', submitter_name: '',
            submitter_phone: '', submitter_email: '', photoFiles: [], videoFiles: []
        });
        setPhotosPreviews([]);
        setVideosPreviews([]);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const addAsset = () => {
        if (formData.newAsset.trim()) {
            setFormData(prev => ({
                ...prev,
                assets: [...prev.assets, prev.newAsset.trim()],
                newAsset: ''
            }));
            if (errors.assets) {
                setErrors(prev => ({ ...prev, assets: '' }));
            }
        }
    };

    const removeAsset = (index) => {
        setFormData(prev => ({
            ...prev,
            assets: prev.assets.filter((_, i) => i !== index)
        }));
    };

    const addAdvantage = () => {
        if (formData.newAdvantage.trim()) {
            setFormData(prev => ({
                ...prev,
                advantages: [...prev.advantages, prev.newAdvantage.trim()],
                newAdvantage: ''
            }));
            if (errors.advantages) {
                setErrors(prev => ({ ...prev, advantages: '' }));
            }
        }
    };

    const removeAdvantage = (index) => {
        setFormData(prev => ({
            ...prev,
            advantages: prev.advantages.filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = (e, type) => {
        const files = Array.from(e.target.files);

        if (type === 'photos') {
            setFormData(prev => ({
                ...prev,
                photoFiles: [...prev.photoFiles, ...files]
            }));

            const previews = files.map(file => ({
                name: file.name,
                size: file.size,
                url: URL.createObjectURL(file)
            }));

            setPhotosPreviews(prev => [...prev, ...previews]);
        } else {
            setFormData(prev => ({
                ...prev,
                videoFiles: [...prev.videoFiles, ...files]
            }));

            const previews = files.map(file => ({
                name: file.name,
                size: file.size,
                url: URL.createObjectURL(file)
            }));

            setVideosPreviews(prev => [...prev, ...previews]);
        }
    };

    const removeFile = (index, type) => {
        if (type === 'photos') {
            URL.revokeObjectURL(photosPreviews[index].url);
            setFormData(prev => ({
                ...prev,
                photoFiles: prev.photoFiles.filter((_, i) => i !== index)
            }));
            setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            URL.revokeObjectURL(videosPreviews[index].url);
            setFormData(prev => ({
                ...prev,
                videoFiles: prev.videoFiles.filter((_, i) => i !== index)
            }));
            setVideosPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatCurrency = (value) => {
        const number = value.replace(/[^0-9]/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;
        const formatted = formatCurrency(value);
        setFormData(prev => ({ ...prev, [name]: formatted }));
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Note:</strong> Votre annonce sera examinée par notre équipe avant d'être publiée sur la plateforme.
                </Typography>
            </Alert>

            <Box component="form" onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <BusinessIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Informations de base</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    label="Nom de l'entreprise"
                                    name="name"
                                    prefix={<FaBuilding />}
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    errorMessage={errors.name}
                                    isRequired
                                    placeholder="Ex: Restaurant Le Soleil"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <SelectField
                                    label="Catégorie"
                                    name="category"
                                    prefixIcon={<FaLayerGroup />}
                                    value={formData.category}
                                    onChange={handleChange}
                                    searchPlaceholder='Recherche'
                                    options={businessCategories}
                                    error={!!errors.category}
                                    helperText={errors.category}
                                    isRequired
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    label="Localisation"
                                    name="location"
                                    isRequired
                                    value={formData.location}
                                    prefix={<FaCity />}
                                    onChange={handleChange}
                                    error={!!errors.location}
                                    errorMessage={errors.location}
                                    placeholder="Ex: Ouagadougou, Secteur 15"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <SelectField
                                    label="Année de création"
                                    onChange={handleChange}
                                    name="year_established"
                                    value={formData.year_established}
                                    searchPlaceholder='Recherche'
                                    prefixIcon={<BiCalendar />}
                                    options={years}
                                    error={!!errors.year_established}
                                    helperText={errors.year_established}
                                    isRequired
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    prefix={<FaMap />}
                                    label="Adresse complète"
                                    name="full_address"
                                    value={formData.full_address}
                                    onChange={handleChange}
                                    placeholder="Ex: Avenue Charles de Gaulle, Secteur 12"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <TextArea
                                    fullWidth
                                    label="Description de l'entreprise"
                                    name="description"
                                    multiline
                                    rows={4}
                                    isRequired
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                    placeholder="Décrivez votre entreprise..."
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }} >
                                <TextArea
                                    fullWidth
                                    label="Informations supplémentaires"
                                    name="additional_info"
                                    multiline
                                    rows={4}
                                    value={formData.additional_info}
                                    onChange={handleChange}
                                    placeholder="Informations utiles..."
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Financial Information */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Informations financières</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    label="Prix demandé (FCFA)"
                                    name="price"
                                    isRequired
                                    value={formData.price}
                                    onChange={handleCurrencyChange}
                                    error={!!errors.price}
                                    errorMessage={errors.price}
                                    placeholder="2 500 000"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }} >
                                <InputField
                                    fullWidth
                                    label="CA mensuel (FCFA)"
                                    name="monthly_revenue"
                                    value={formData.monthly_revenue}
                                    onChange={handleCurrencyChange}
                                    placeholder="500 000"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }} >
                                <InputField
                                    fullWidth
                                    label="CA annuel (FCFA)"
                                    name="yearly_revenue"
                                    value={formData.yearly_revenue}
                                    onChange={handleCurrencyChange}
                                    placeholder="6 000 000"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }} >
                                <InputField
                                    fullWidth
                                    label="Nombre d'employés"
                                    name="employees"
                                    type="number"
                                    value={formData.employees}
                                    onChange={handleChange}
                                    error={!!errors.employees}
                                    errorMessage={errors.employees}
                                    placeholder="5"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    label="Raison de la vente"
                                    name="reasons"
                                    value={formData.reasons}
                                    onChange={handleChange}
                                    placeholder="Ex: Déménagement, retraite..."
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Assets and Advantages */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <PeopleIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Équipements et avantages</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Équipements et actifs inclus *
                                </Typography>
                                <Box display="flex" gap={1} mb={2}>
                                    <TextField
                                        fullWidth
                                        label="Ajouter un équipement"
                                        value={formData.newAsset}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newAsset: e.target.value }))}
                                        onKeyUp={(e) => e.key === 'Enter' && (e.preventDefault(), addAsset())}
                                        placeholder="Ex: Équipement de cuisine..."
                                    />
                                    <Button variant="outlined" onClick={addAsset} startIcon={<PlusIcon />}>
                                        Ajouter
                                    </Button>
                                </Box>

                                {formData.assets.length > 0 && (
                                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                        {formData.assets.map((asset, index) => (
                                            <Chip
                                                key={index}
                                                label={asset}
                                                onDelete={() => removeAsset(index)}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                )}

                                {errors.assets && (
                                    <Typography variant="caption" color="error">{errors.assets}</Typography>
                                )}
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Avantages de votre entreprise *
                                </Typography>
                                <Box display="flex" gap={1} mb={2}>
                                    <TextField
                                        fullWidth
                                        label="Ajouter un avantage"
                                        value={formData.newAdvantage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newAdvantage: e.target.value }))}
                                        onKeyUp={(e) => e.key === 'Enter' && (e.preventDefault(), addAdvantage())}
                                        placeholder="Ex: Emplacement stratégique..."
                                    />
                                    <Button variant="outlined" onClick={addAdvantage} startIcon={<PlusIcon />}>
                                        Ajouter
                                    </Button>
                                </Box>

                                {formData.advantages.length > 0 && (
                                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                        {formData.advantages.map((advantage, index) => (
                                            <Chip
                                                key={index}
                                                label={advantage}
                                                onDelete={() => removeAdvantage(index)}
                                                color="success"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                )}

                                {errors.advantages && (
                                    <Typography variant="caption" color="error">{errors.advantages}</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Media Upload */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <ImageIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Photos et vidéos</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    Photos de l'entreprise
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        border: '2px dashed',
                                        borderColor: 'grey.300',
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: 'success.main', bgcolor: 'action.hover' }
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="photo-upload"
                                        multiple
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'photos')}
                                    />
                                    <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
                                        <ImageIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                            Cliquez pour ajouter des photos
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            JPG, PNG, GIF (max 5MB par photo)
                                        </Typography>
                                    </label>
                                </Paper>

                                {photosPreviews.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {photosPreviews.map((photo, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon><ImageIcon color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary={photo.name}
                                                    secondary={formatFileSize(photo.size)}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton onClick={() => removeFile(index, 'photos')} color="error">
                                                        <CloseIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    Vidéos de l'entreprise
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        border: '2px dashed',
                                        borderColor: 'grey.300',
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: 'success.main', bgcolor: 'action.hover' }
                                    }}
                                >
                                    <input
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        id="video-upload"
                                        multiple
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'videos')}
                                    />
                                    <label htmlFor="video-upload" style={{ cursor: 'pointer' }}>
                                        <VideoIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                            Cliquez pour ajouter des vidéos
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            MP4, MOV, AVI (max 50MB par vidéo)
                                        </Typography>
                                    </label>
                                </Paper>

                                {videosPreviews.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {videosPreviews.map((video, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon><VideoIcon color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary={video.name}
                                                    secondary={formatFileSize(video.size)}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton onClick={() => removeFile(index, 'videos')} color="error">
                                                        <CloseIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Contact Information */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <InfoIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Vos coordonnées</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Votre nom *"
                                    name="submitter_name"
                                    value={formData.submitter_name}
                                    onChange={handleChange}
                                    error={!!errors.submitter_name}
                                    helperText={errors.submitter_name}
                                    placeholder="Nom complet"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Téléphone *"
                                    name="submitter_phone"
                                    value={formData.submitter_phone}
                                    onChange={handleChange}
                                    error={!!errors.submitter_phone}
                                    helperText={errors.submitter_phone}
                                    placeholder="+226 70 XX XX XX"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Email *"
                                    name="submitter_email"
                                    type="email"
                                    value={formData.submitter_email}
                                    onChange={handleChange}
                                    error={!!errors.submitter_email}
                                    helperText={errors.submitter_email}
                                    placeholder="votre@email.com"
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Submit Button */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {onClose && (
                        <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
                            Annuler
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Soumettre l\'entreprise'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default BusinessFormPage;
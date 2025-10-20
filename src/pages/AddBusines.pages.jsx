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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container
} from '@mui/material';
import {
    MdAdd as PlusIcon,
    MdClose as CloseIcon,
    MdCloudUpload as UploadIcon,
    MdImage as ImageIcon,
    MdVideoLibrary as VideoIcon,
    MdExpandMore as ExpandMoreIcon,
    MdBusiness as BusinessIcon,
    MdAttachMoney as MoneyIcon,
    MdPeople as PeopleIcon,
    MdInfo as InfoIcon,
    MdWarning as WarningIcon,
    MdCheck as CheckIcon
} from 'react-icons/md';
import { InputField, SelectField } from '../components/Form.components';
import { BiCalendar } from 'react-icons/bi';
import { FaBuilding, FaCity, FaLayerGroup, FaMap } from 'react-icons/fa';

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
        // Basic Information
        name: '',
        category: '',
        location: '',
        fullAddress: '',
        description: '',
        additionalInfo: '',
        price: '',

        // Business Details
        yearEstablished: '',
        employees: '',
        monthlyRevenue: '',
        yearlyRevenue: '',

        // Assets and Advantages
        assets: [],
        newAsset: '',
        advantages: [],
        newAdvantage: '',
        reasons: '',

        // Contact Information
        contactName: '',
        contactPhone: '',
        contactEmail: '',

        // Media
        photos: [],
        videos: []
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        const requiredFields = [
            'name', 'category', 'location', 'description', 'price',
            'yearEstablished', 'employees', 'contactName', 'contactPhone', 'contactEmail'
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
            // Transform form data to match the business structure
            const businessData = {
                name: formData.name,
                category: formData.category,
                location: formData.location,
                fullAddress: formData.fullAddress,
                description: formData.description,
                additionalInfo: formData.additionalInfo,
                price: parseInt(formData.price.replace(/[^0-9]/g, '')),
                yearEstablished: parseInt(formData.yearEstablished),
                status: 'PENDING',
                datePosted: new Date().toLocaleDateString('fr-FR'),
                businessNumber: `BF${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,

                photos: formData.photos,
                videos: formData.videos,

                owner: {
                    name: formData.contactName,
                    phone: formData.contactPhone,
                    email: formData.contactEmail,
                    memberSince: new Date().getFullYear().toString()
                },

                businessDetails: {
                    employees: parseInt(formData.employees),
                    monthlyRevenue: formData.monthlyRevenue ? parseInt(formData.monthlyRevenue.replace(/[^0-9]/g, '')) : 0,
                    yearlyRevenue: formData.yearlyRevenue ? parseInt(formData.yearlyRevenue.replace(/[^0-9]/g, '')) : 0,
                    assets: formData.assets,
                    reasons: formData.reasons,
                    advantages: formData.advantages
                }
            };

            onSubmit(businessData);
            resetForm();
            onClose();
            alert('Votre entreprise a été soumise avec succès ! Elle sera examinée par notre équipe avant publication.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', category: '', location: '', fullAddress: '', description: '',
            additionalInfo: '', price: '', yearEstablished: '', employees: '',
            monthlyRevenue: '', yearlyRevenue: '', assets: [], newAsset: '',
            advantages: [], newAdvantage: '', reasons: '', contactName: '',
            contactPhone: '', contactEmail: '', photos: [], videos: []
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
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
        const fileData = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
        }));

        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], ...fileData]
        }));
    };

    const removeFile = (index, type) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
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
                                    prefix={<FaBuilding/>}
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
                                    label={"Category"}
                                    name={"category"}
                                    prefixIcon={<FaLayerGroup/>}
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
                                    prefix={<FaCity/>}
                                    onChange={handleChange}
                                    error={!!errors.location}
                                    errorMessage={errors.location}
                                    placeholder="Ex: Ouagadougou, Secteur 15"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <SelectField
                                    label={"Année de création"}
                                    onChange={handleChange}
                                    name="yearEstablished"
                                    searchPlaceholder='Recherche'
                                    prefixIcon={<BiCalendar />}
                                    options={years}
                                    isRequired
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    prefix={<FaMap/>}
                                    label="Adresse complète"
                                    name="fullAddress"
                                    value={formData.fullAddress}
                                    onChange={handleChange}
                                    placeholder="Ex: Avenue Charles de Gaulle, Secteur 12, Ouagadougou"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Description de l'entreprise *"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={!!errors.description}
                                    helperText={errors.description}
                                    placeholder="Décrivez votre entreprise: type d'activité, spécialités, clientèle..."
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Informations supplémentaires"
                                    name="additionalInfo"
                                    multiline
                                    rows={4}
                                    value={formData.additionalInfo}
                                    onChange={handleChange}
                                    placeholder="Informations utiles pour l'acheteur..."
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Financial Information */}
                <Accordion expanded> 
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

                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <InputField
                                    fullWidth
                                    label="CA mensuel (FCFA)"
                                    name="monthlyRevenue"
                                    value={formData.monthlyRevenue}
                                    onChange={handleCurrencyChange}
                                    placeholder="500 000"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="CA annuel (FCFA)"
                                    name="yearlyRevenue"
                                    value={formData.yearlyRevenue}
                                    onChange={handleCurrencyChange}
                                    placeholder="6 000 000"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre d'employés *"
                                    name="employees"
                                    type="number"
                                    value={formData.employees}
                                    onChange={handleChange}
                                    error={!!errors.employees}
                                    helperText={errors.employees}
                                    placeholder="5"
                                />
                            </Grid>

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Raison de la vente"
                                    name="reasons"
                                    value={formData.reasons}
                                    onChange={handleChange}
                                    placeholder="Ex: Déménagement, retraite, nouveau projet..."
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
                            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Équipements et actifs inclus *
                                </Typography>
                                <Box display="flex" gap={1} mb={2}>
                                    <TextField
                                        fullWidth
                                        label="Ajouter un équipement"
                                        value={formData.newAsset}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newAsset: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAsset())}
                                        placeholder="Ex: Équipement de cuisine, Mobilier..."
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

                            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Avantages de votre entreprise *
                                </Typography>
                                <Box display="flex" gap={1} mb={2}>
                                    <TextField
                                        fullWidth
                                        label="Ajouter un avantage"
                                        value={formData.newAdvantage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, newAdvantage: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAdvantage())}
                                        placeholder="Ex: Emplacement stratégique, Clientèle fidèle..."
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
                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
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
                                    <label htmlFor="photo-upload">
                                        <ImageIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                            Cliquez pour ajouter des photos
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            JPG, PNG, GIF (max 5MB par photo)
                                        </Typography>
                                    </label>
                                </Paper>

                                {formData.photos.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {formData.photos.map((photo, index) => (
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

                            <Grid size={{ md: 6, sm: 12, xs: 12 }}>
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
                                    <label htmlFor="video-upload">
                                        <VideoIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                            Cliquez pour ajouter des vidéos
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            MP4, MOV, AVI (max 50MB par vidéo)
                                        </Typography>
                                    </label>
                                </Paper>

                                {formData.videos.length > 0 && (
                                    <List sx={{ mt: 2 }}>
                                        {formData.videos.map((video, index) => (
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
                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Votre nom *"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    error={!!errors.contactName}
                                    helperText={errors.contactName}
                                    placeholder="Nom complet"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Téléphone *"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    error={!!errors.contactPhone}
                                    helperText={errors.contactPhone}
                                    placeholder="+226 70 XX XX XX"
                                />
                            </Grid>

                            <Grid size={{ md: 4, sm: 12, xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Email *"
                                    name="contactEmail"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    error={!!errors.contactEmail}
                                    helperText={errors.contactEmail}
                                    placeholder="votre@email.com"
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Container>


    );
}
export default BusinessFormPage
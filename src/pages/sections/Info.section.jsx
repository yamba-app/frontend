import {
    TextField,
    Typography,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    MdExpandMore as ExpandMoreIcon,
    MdBusiness as BusinessIcon,
} from 'react-icons/md';
import { BiCalendar } from 'react-icons/bi';
import { FaBuilding, FaCity, FaLayerGroup, FaMap } from 'react-icons/fa';
import { InputField, SelectField } from '../../components/Form.components';
// Section Components+

// Constants
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

const BasicInfoSection = ({ formData, errors, handleChange }) => (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BusinessIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Informations de base</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={3}>
                    <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        label="Nom de l'entreprise"
                        name="name"
                        fullWidth
                        prefix={<FaBuilding />}
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        errorMessage={errors.name}
                        isRequired
                        placeholder="Ex: Restaurant Le Soleil"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <SelectField
                        label="Catégorie"
                        name="category"
                        fullWidth
                        prefixIcon={<FaLayerGroup />}
                        value={formData.category}
                        onChange={handleChange}
                        options={businessCategories}
                        error={!!errors.category}
                        helperText={errors.category}
                        isRequired
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        label="Localisation"
                        name="location"
                        isRequired
                        fullWidth
                        value={formData.location}
                        prefix={<FaCity />}
                        onChange={handleChange}
                        error={!!errors.location}
                        errorMessage={errors.location}
                        placeholder="Ex: Ouagadougou, Secteur 15"
                    />
                </Grid>

                <Grid size={{md:6,sm:12,xs:12}}>
                    <SelectField
                        label="Année de création"
                        name="yearEstablished"
                        
                        value={formData.yearEstablished}
                        onChange={handleChange}
                        prefixIcon={<BiCalendar />}
                        options={years}
                        error={!!errors.yearEstablished}
                        helperText={errors.yearEstablished}
                        isRequired
                    />
                </Grid>

                <Grid size={{md:6,sm:12,xs:12}}>
                    <InputField
                        prefix={<FaMap />}
                        label="Adresse complète"
                        name="fullAddress"
                        fullWidth
                        value={formData.fullAddress}
                        onChange={handleChange}
                        placeholder="Ex: Avenue Charles de Gaulle, Secteur 12, Ouagadougou"
                    />
                </Grid>

                <Grid size={{md:6,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Description de l'entreprise *"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        errorMessage={errors.description}
                        placeholder="Décrivez votre entreprise: type d'activité, spécialités, clientèle..."
                    />
                </Grid>

                <Grid size={{md:6,sm:12,xs:12}}>
                    <InputField
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
);
export default BasicInfoSection
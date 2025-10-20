import {
    Typography,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    MdExpandMore as ExpandMoreIcon,
    MdInfo as InfoIcon
} from 'react-icons/md';
import { InputField } from '../../components/Form.components';


const ContactSection = ({ formData, errors, handleChange }) => (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <InfoIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Vos coordonnées</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={3}>
                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Votre nom"
                        name="contactName"
                        isRequired
                        value={formData.contactName}
                        onChange={handleChange}
                        error={!!errors.contactName}
                        errorMessage={errors.contactName}
                        placeholder="Nom complet"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Téléphone"
                        name="contactPhone"
                        isRequired
                        inputType={"phone"}
                        value={formData.contactPhone}
                        onChange={handleChange}
                        error={!!errors.contactPhone}
                        errorMessage={errors.contactPhone}
                        placeholder="+226 70 XX XX XX"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Email "
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        error={!!errors.contactEmail}
                        errorMessage={errors.contactEmail}
                        placeholder="votre@email.com"
                    />
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
);

export default ContactSection
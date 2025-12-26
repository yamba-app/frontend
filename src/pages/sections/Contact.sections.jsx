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
            <Typography variant="h6">Information du Responsable</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={3}>
                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Votre nom"
                        name="contact_name"
                        isRequired
                        value={formData.contact_name}
                        onChange={handleChange}
                        error={!!errors.contact_name}
                        errorMessage={errors.contact_name}
                        placeholder="Nom complet"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Téléphone"
                        name="contact_phone"
                        isRequired
                        inputType={"phone"}
                        value={formData.contact_phone}
                        onChange={handleChange}
                        error={!!errors.contact_phone}
                        errorMessage={errors.contact_phone}
                        placeholder="70 XX XX XX"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Email "
                        name="contact_email"
                        type="email"
                        isRequired={true}
                        value={formData.contact_email}
                        onChange={handleChange}
                        error={!!errors.contact_email}
                        errorMessage={errors.contact_email}
                        placeholder="votre@email.com"
                    />
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
);

export default ContactSection
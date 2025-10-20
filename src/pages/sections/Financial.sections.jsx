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
    MdAttachMoney as MoneyIcon,
} from 'react-icons/md';
import { InputField } from '../../components/Form.components';

const FinancialInfoSection = ({ formData, errors, handleChange, handleCurrencyChange }) => (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MoneyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Informations financières</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={3}>
                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        label="Prix demandé (FCFA)"
                        name="price"
                        isRequired
                        fullWidth
                        value={formData.price}
                        onChange={handleCurrencyChange}
                        error={!!errors.price}
                        errorMessage={errors.price}
                        placeholder="2 500 000"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        label="CA mensuel (FCFA)"
                        name="monthlyRevenue"
                        fullWidth
                        value={formData.monthlyRevenue}
                        onChange={handleCurrencyChange}
                        placeholder="500 000"
                    />
                </Grid>

                <Grid size={{md:4,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="CA annuel (FCFA)"
                        name="yearlyRevenue"
                        value={formData.yearlyRevenue}
                        onChange={handleCurrencyChange}
                        placeholder="6 000 000"
                    />
                </Grid>

                <Grid size={{md:6,sm:12,xs:12}}>
                    <InputField
                        fullWidth
                        label="Nombre d'employés *"
                        name="employees"
                        type="number"
                        value={formData.employees}
                        onChange={handleChange}
                        error={!!errors.employees}
                        errorMessage={errors.employees}
                        placeholder="5"
                    />
                </Grid>

                <Grid size={{md:6,sm:12,xs:12}}>
                    <InputField
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
);
export default FinancialInfoSection
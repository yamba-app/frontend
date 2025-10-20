import {
    Typography,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Chip,
    Button,
    Box,
} from '@mui/material';
import { FaAd } from 'react-icons/fa';
import {
    MdExpandMore as ExpandMoreIcon,
    MdPeople as PeopleIcon,
} from 'react-icons/md';

const ItemInput = ({ label, placeholder, value, onChange, onAdd, onKeyPress }) => (
    <Box display="flex" gap={1} mb={2}>
        <TextField
            fullWidth
            label={label}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyPress}
            placeholder={placeholder}
        />
        <Button variant="outlined" onClick={onAdd} startIcon={<FaAd />}>
            Ajouter
        </Button>
    </Box>
);

const ChipList = ({ items, onRemove, color = "primary" }) => (
    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {items.map((item, index) => (
            <Chip
                key={index}
                label={item}
                onDelete={() => onRemove(index)}
                color={color}
                variant="outlined"
            />
        ))}
    </Box>
);

const AssetsAvantageSections = ({ formData, setFormData, errors, setErrors }) => {
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

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Équipements et avantages</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid size={{xs:12}}>
                        <Typography variant="subtitle1" gutterBottom>
                            Équipements et actifs inclus *
                        </Typography>
                        <ItemInput
                            label="Ajouter un équipement"
                            value={formData.newAsset}
                            onChange={(e) => setFormData(prev => ({ ...prev, newAsset: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAsset())}
                            onAdd={addAsset}
                            placeholder="Ex: Équipement de cuisine, Mobilier..."
                        />

                        {formData.assets.length > 0 && (
                            <ChipList items={formData.assets} onRemove={removeAsset} color="primary" />
                        )}

                        {errors.assets && (
                            <Typography variant="caption" color="error">{errors.assets}</Typography>
                        )}
                    </Grid>

                    <Grid size={{xs:12}}>
                        <Typography variant="subtitle1" gutterBottom>
                            Avantages de votre entreprise *
                        </Typography>
                        <ItemInput
                            label="Ajouter un avantage"
                            value={formData.newAdvantage}
                            onChange={(e) => setFormData(prev => ({ ...prev, newAdvantage: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAdvantage())}
                            onAdd={addAdvantage}
                            placeholder="Ex: Emplacement stratégique, Clientèle fidèle..."
                        />

                        {formData.advantages.length > 0 && (
                            <ChipList items={formData.advantages} onRemove={removeAdvantage} color="success" />
                        )}

                        {errors.advantages && (
                            <Typography variant="caption" color="error">{errors.advantages}</Typography>
                        )}
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default AssetsAvantageSections
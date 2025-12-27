// ContactPage.jsx
import { useCallback, useState } from 'react';

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import {
  MdPhone as PhoneIcon,
  MdEmail as MailIcon,
  MdLocationOn as MapPinIcon,
  MdSend as SendIcon
} from 'react-icons/md';
import { useTheme } from '@mui/material/styles';
import { InputField, SelectField, TextArea } from '../components/Form.components';
import DOMPurify from 'dompurify';
import { fetchCsrfToken } from '../core/token/csrf.token';
import { axiosPrivate } from '../core/instance/axios.instance';
import useToast from '../components/Toast.components';
import { contactValidator } from '../utils/functions/inputValidations.functions';
import { CircularProgress } from '@mui/material';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { showToast , ToastComponent } = useToast();
  const contactSchema = contactValidator();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await contactSchema.validate(formData, { abortEarly: false });
            await fetchCsrfToken();
            const clientData = {
                ...formData
            };
            const response = await axiosPrivate.post('/api/contact', clientData);
            if (response.status === 200 || response.status === 201) {
        
                setFormData({ name: "", email: "" , subject: "", message: "" });
                showToast({ title: "Success", description: response.data.message, status: "success" });
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                showToast({ title: "", description: error.response.data.message, status: "error" });
            } else if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((err) => { validationErrors[err.path] = err.message; });
                setErrors(validationErrors);
            } else {
                showToast({ title: "", description: error.message, status: "error" });
            }
        } finally {
            setIsLoading(false);
        }
    }, [contactSchema, formData, showToast]);

   const handleInputChange = useCallback((event) => {
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

  const contactInfo = [
    {
      icon: <PhoneIcon color="white" size={"24"} />,
      title: "Téléphone",
      value: "+226 65402020",
      subtitle: "Du lundi au vendredi, 8h - 18h"
    },
    {
      icon: <MailIcon color="white" size={"24"}/>,
      title: "Email", 
      value: "services@yamba-dh.com",
      subtitle: "Réponse sous 24h"
    },
    {
      icon: <MapPinIcon color="white" size={"24"} />,
      title: "Adresse",
      value: "Ouagadougou, Burkina Faso\nSecteur 30,",
      subtitle: ""
    }
  ];

  const faqItems = [
    {
      question: "Comment publier une annonce ?",
      answer: "Cliquez sur \"Publier une entreprise\" sur la page d'accueil et remplissez le formulaire."
    },
    {
      question: "Le service est-il gratuit ?", 
      answer: "Oui, VenteAffaires BF est 100% gratuit pour tous les utilisateurs."
    },
    {
      question: "Comment contacter un vendeur ?",
      answer: "Utilisez le numéro de téléphone affiché sur chaque annonce d'entreprise."
    }
  ];

  const subjectOptions = [
    { key: "question", value: "Question générale" },
    { key: "probleme", value: "Problème technique" },
    { key: "suggestion", value: "Suggestion d'amélioration" },
    { key: "signalement", value: "Signaler une annonce" },
    { key: "partenariat", value: "Proposition de partenariat" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' }}}>
          Nous contacter
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{fontSize:{md:"1.9rem", sm:"1rem"}}}>
          Une question ? Un problème ? N'hésitez pas à nous contacter, nous sommes là pour vous aider !
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid size={{md:6,sm:12,xs:12}}>
          <Paper elevation={3} sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '2rem', md: '3.5rem' } }}>
              Nos coordonnées
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              {contactInfo.map((info, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      bgcolor: 'success.light',
                      color: 'success.main',
                      p: 1.5,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 48,
                      height: 48
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
                      {info.value}
                    </Typography>
                    {info.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {info.subtitle}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                bgcolor: theme.palette.primary.light,
                '& .MuiTypography-root': {
                  color: "white"
                }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 2, color: 'success.dark' }}>
                Questions fréquentes
              </Typography>
              <Box sx={{ space: 2 }}>
                {faqItems.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                      {item.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {item.answer}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid size={{md:6,sm:12,xs:12}}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Envoyez-nous un message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{md:12,sm:12,xs:12}}>
                  <InputField
                    fullWidth
                    label="Votre nom"
                    name="name"
                    value={formData.name}
                    error={!!errors.name}
                    errorMessage={errors.name}
                    onChange={handleInputChange}
                    isRequired={true}
                  />
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <InputField
                    fullWidth
                    label="Email "
                    name="email"
                    type="email"
                    error={!!errors.email}
                    errorMessage={errors.email}
                    value={formData.email}
                    onChange={handleInputChange}
                    isRequired={true}
                  />
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <SelectField
                    fullWidth
                    select
                    label="Sujet du message"
                    name="subject"
                    value={formData.subject}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    onChange={handleInputChange}
                    isRequired={true}
                    options={subjectOptions}
                  />
                    
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <TextArea
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    error={!!errors.message}
                    helperText={errors.message}
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre demande en détail..."
                    
                  />
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isLoading}
                    size="large"
                    sx={{color:"white"}}
                    fullWidth
                    startIcon={<SendIcon color='white'/>}
                  >
                    {isLoading ? <CircularProgress size={20} /> : 'Envoyer le message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
                  {ToastComponent}

    </Container>
  );
}

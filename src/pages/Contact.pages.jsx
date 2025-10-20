// ContactPage.jsx
import { useState } from 'react';

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import {
  MdPhone as PhoneIcon,
  MdEmail as MailIcon,
  MdLocationOn as MapPinIcon,
  MdSend as SendIcon
} from 'react-icons/md';
import { useTheme } from '@mui/material/styles';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      value: "vabf@yamba-dh.com",
      subtitle: "Réponse sous 24h"
    },
    {
      icon: <MapPinIcon color="white" size={"24"} />,
      title: "Adresse",
      value: "Ouagadougou, Burkina Faso\nSecteur 30, Rue XX.XX",
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
    { value: "question", label: "Question générale" },
    { value: "probleme", label: "Problème technique" },
    { value: "suggestion", label: "Suggestion d'amélioration" },
    { value: "signalement", label: "Signaler une annonce" },
    { value: "partenariat", label: "Proposition de partenariat" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Nous contacter
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Une question ? Un problème ? N'hésitez pas à nous contacter, nous sommes là pour vous aider !
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid size={{md:6,sm:12,xs:12}}>
          <Paper elevation={3} sx={{ p: 4, height: 'fit-content' }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
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
                  color: theme.palette.success.contrastText
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
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Envoyez-nous un message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{md:12,sm:12,xs:12}}>
                  <TextField
                    fullWidth
                    label="Votre nom *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <TextField
                    fullWidth
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <TextField
                    fullWidth
                    select
                    label="Sujet *"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="">Choisissez un sujet</MenuItem>
                    {subjectOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande en détail..."
                    
                  />
                </Grid>

                <Grid size={{md:12,sm:12,xs:12}}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{color:"white"}}
                    fullWidth
                    startIcon={<SendIcon color='white'/>}
                  >
                    Envoyer le message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

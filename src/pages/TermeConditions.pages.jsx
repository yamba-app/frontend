import { Container, Typography, Box, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { MdExpandMore, MdGavel, MdSecurity, MdInfo, MdWarning, MdVerifiedUser } from 'react-icons/md';

const TermsAndConditionsPage = () => {
  const sections = [
    {
      icon: <MdInfo />,
      title: "1. Objet de la plateforme",
      content: `Vente Business BF est une plateforme de mise en relation entre vendeurs et acheteurs d'entreprises au Burkina Faso. Nous ne sommes ni une agence immobilière, ni un cabinet juridique. Notre rôle est exclusivement technique : faciliter les contacts et héberger les annonces.`
    },
    {
      icon: <MdVerifiedUser />,
      title: "2. Services proposés",
      content: `• Consultation gratuite des annonces publiques
• Services Premium (10 000 FCFA/mois) : accès aux coordonnées complètes
• Frais de mise en relation (15 000 FCFA) : contact direct avec les vendeurs
• Services d'accompagnement via nos partenaires professionnels`
    },
    {
      icon: <MdWarning />,
      title: "3. Notre responsabilité",
      content: `Vente Business BF agit uniquement comme intermédiaire technique. Nous ne garantissons pas :
• La véracité des informations publiées
• La réalité économique des entreprises
• Le succès des transactions
• L'absence de fraude

Chaque utilisateur est responsable des informations qu'il publie.`
    },
    {
      icon: <MdGavel />,
      title: "4. Vos responsabilités",
      content: `En tant que vendeur, vous garantissez :
• Être propriétaire légitime du business
• Fournir des informations exactes et complètes
• Ne violer aucun droit de tiers

En tant qu'acheteur, vous devez :
• Effectuer votre propre vérification ("due diligence")
• Consulter des professionnels qualifiés
• Vérifier tous les documents avant transaction`
    },
    {
      icon: <MdSecurity />,
      title: "5. Protection et sécurité",
      content: `Contenus interdits :
• Fausses annonces et informations trompeuses
• Entreprises en vente illégale
• Contenus diffamatoires

Vos données sont protégées conformément à la Loi 010 2021/AN du Burkina Faso.

En cas de fraude détectée, nous suspendons immédiatement le compte et transmettons aux autorités compétentes.`
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #28a745, #20c997)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Conditions Générales d'Utilisation
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Vente Business BF - Version 2025
        </Typography>
      </Box>

      {/* Important Notice */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 4,
          background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
          border: '2px solid #ffc107'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <MdWarning size={24} />
          Important à savoir
        </Typography>
        <Typography variant="body1" paragraph>
          En utilisant notre plateforme, vous acceptez ces conditions. Vente Business BF est un simple intermédiaire : nous ne participons pas aux négociations ni aux transactions.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Conseil :</strong> Faites toujours appel à un avocat, notaire ou expert-comptable avant toute transaction importante.
        </Typography>
      </Paper>

      {/* Sections */}
      <Box sx={{ mb: 4 }}>
        {sections.map((section, index) => (
          <Accordion 
            key={index}
            defaultExpanded={index === 0}
            sx={{ 
              mb: 2,
              '&:before': { display: 'none' },
              boxShadow: 2
            }}
          >
            <AccordionSummary 
              expandIcon={<MdExpandMore />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }
              }}
            >
              <Box sx={{ color: '#28a745', display: 'flex', alignItems: 'center' }}>
                {section.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {section.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Legal Footer */}
      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Droit applicable
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ces conditions sont régies par le Code civil burkinabè, les Actes uniformes OHADA et la Loi 010 2021/AN sur la protection des données. Toute modification sera notifiée aux utilisateurs.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Contact :</strong> Pour toute question, contactez-nous via notre formulaire de support.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsAndConditionsPage;
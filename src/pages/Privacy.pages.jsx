import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails, Alert, Chip } from '@mui/material';
import { MdExpandMore, MdLock, MdStorage, MdShare, MdSecurity, MdTimer, MdVerifiedUser } from 'react-icons/md';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <MdStorage />,
      title: "1. Données collectées",
      content: `Données que vous nous fournissez :
• Nom, prénom, téléphone, email
• Informations sur votre entreprise
• Documents et images volontairement transmis

Données collectées automatiquement :
• Adresse IP et données de connexion
• Type de navigateur et pages consultées
• Durée de navigation
• Géolocalisation (si autorisée)

Données sensibles (services premium uniquement) :
• Valeur estimée de l'entreprise
• Bilans financiers et chiffres d'affaires
• Documents stratégiques`
    },
    {
      icon: <MdVerifiedUser />,
      title: "2. Utilisation de vos données",
      content: `Nous utilisons vos données pour :

Fonctionnement du service :
• Gestion de votre compte
• Publication d'annonces
• Mise en relation vendeur/acheteur
• Services premium et paiements

Sécurité :
• Détection d'activités suspectes
• Vérification d'identité
• Lutte contre la fraude

Amélioration :
• Analyses statistiques
• Optimisation de l'expérience utilisateur
• Développement de nouveaux services`
    },
    {
      icon: <MdShare />,
      title: "3. Partage de vos données",
      content: `Vos données peuvent être partagées avec :

Partenaires techniques :
• Hébergeur web sécurisé
• Prestataires de paiement
• Services de messagerie et SMS

Partenaires professionnels :
• Avocats, notaires, experts-comptables
(UNIQUEMENT avec votre consentement explicite)

Autorités publiques :
• En cas de fraude ou sur demande judiciaire

⚠️ Vos données sensibles ne sont JAMAIS rendues publiques sans votre accord.`
    },
    {
      icon: <MdTimer />,
      title: "4. Conservation des données",
      content: `Durée de conservation :
• Pendant l'utilisation active de votre compte
• 24 mois après désactivation (sauf obligation légale)
• 5 ans pour les données de facturation (obligation comptable)

Vous pouvez demander la suppression de votre compte à tout moment.`
    },
    {
      icon: <MdLock />,
      title: "5. Vos droits",
      content: `Conformément à la Loi 010 2021/AN du Burkina Faso, vous disposez de :

✓ Droit d'accès à vos données
✓ Droit de rectification
✓ Droit d'opposition au traitement
✓ Droit de suppression ("droit à l'oubli")
✓ Droit à la portabilité
✓ Droit de retirer votre consentement

Pour exercer vos droits, contactez-nous via notre formulaire de support.`
    },
    {
      icon: <MdSecurity />,
      title: "6. Sécurité",
      content: `Mesures de protection mises en place :
• Chiffrement des données sensibles
• Accès limité aux personnes autorisées
• Sauvegardes régulières et sécurisées
• Protection contre intrusions et virus
• Audits de sécurité réguliers

En cas de violation de données, vous serez notifié conformément à la loi burkinabè.`
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
            background: 'linear-gradient(45deg, #2196f3, #00bcd4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Politique de Confidentialité
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Protection de vos données personnelles
        </Typography>
      </Box>

      {/* Privacy Badge */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 4,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          border: '2px solid #2196f3'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <MdLock size={32} color="#2196f3" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Vos données sont protégées
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Vente Business BF respecte votre vie privée et protège vos données conformément à la 
          <Chip label="Loi 010 2021/AN" size="small" sx={{ mx: 1 }} />
          du Burkina Faso sur la protection des données à caractère personnel.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cette politique vous explique comment nous collectons, utilisons et protégeons vos informations personnelles.
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
              <Box sx={{ color: '#2196f3', display: 'flex', alignItems: 'center' }}>
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

      {/* Cookies Notice */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          🍪 Cookies et technologies similaires
        </Typography>
        <Typography variant="body2" paragraph>
          Nous utilisons des cookies techniques (indispensables), des cookies de préférences, 
          et des cookies statistiques anonymisés. Les cookies marketing nécessitent votre consentement.
        </Typography>
        <Typography variant="body2">
          Vous pouvez gérer vos préférences dans les paramètres de votre navigateur.
        </Typography>
      </Alert>

      {/* Footer */}
      <Paper sx={{ p: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Contact et modifications
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Pour toute question sur cette politique ou pour exercer vos droits, contactez-nous via 
          notre formulaire de support ou par email.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nous pouvons modifier cette politique à tout moment. Les utilisateurs seront informés 
          des changements importants par email ou notification sur le site.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;
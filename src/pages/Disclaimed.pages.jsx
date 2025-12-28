import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import { MdWarning, MdGavel, MdVerifiedUser, MdSecurity } from 'react-icons/md';

const DisclaimerPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #dc3545, #ff6b6b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Disclaimer Légal Renforcé
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Avertissement important avant toute utilisation
        </Typography>
      </Box>

      {/* Critical Warning */}
      <Alert 
        severity="error" 
        sx={{ 
          mb: 4,
          p: 3,
          '& .MuiAlert-icon': {
            fontSize: '2rem'
          }
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          ⚠️ ATTENTION - À lire impérativement
        </Typography>
        <Typography variant="body1">
          Vente Business BF n'est PAS responsable des transactions, des pertes financières ou des fraudes. 
          Nous sommes uniquement un hébergeur technique. Toute transaction se fait à vos propres risques.
        </Typography>
      </Alert>

      {/* Section 1 */}
      <Paper sx={{ p: 4, mb: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MdWarning size={32} color="#dc3545" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            1. Ce que nous NE sommes PAS
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          Vente Business BF n'est pas :
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            Un cabinet d'avocats ou de conseil juridique
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Un cabinet notarial
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Un cabinet d'expertise comptable
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Un intermédiaire réglementé ou certifié
          </Typography>
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          Nous agissons uniquement comme <strong>hébergeur technique</strong> au sens des standards juridiques internationaux.
        </Alert>
      </Paper>

      {/* Section 2 */}
      <Paper sx={{ p: 4, mb: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MdGavel size={32} color="#dc3545" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            2. Absence totale de garantie
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ fontWeight: 600 }}>
          Nous ne garantissons PAS :
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            L'exactitude ou la véracité des informations publiées
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            La situation juridique, financière ou fiscale réelle d'une entreprise
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Que le vendeur est bien le propriétaire légitime
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Le succès ou l'avantage d'une transaction
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            L'absence de fraude ou d'arnaque
          </Typography>
        </Box>
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Nous déclinons toute responsabilité concernant les pertes financières, les litiges entre utilisateurs 
            et toute forme d'escroquerie liée aux transactions.
          </Typography>
        </Alert>
      </Paper>

      {/* Section 3 */}
      <Paper sx={{ p: 4, mb: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MdVerifiedUser size={32} color="#28a745" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            3. Votre obligation de vérification
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ fontWeight: 600, color: '#28a745' }}>
          Il est de VOTRE RESPONSABILITÉ EXCLUSIVE de :
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            Vérifier l'identité de votre interlocuteur
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Examiner tous les documents juridiques et financiers
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Effectuer une "due diligence" complète (bail, contrats, dettes, licences, etc.)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Consulter un avocat, notaire ou expert-comptable AVANT toute transaction
          </Typography>
        </Box>
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Recommandation :</strong> Ne concluez JAMAIS une transaction sans l'assistance 
            d'un professionnel qualifié. C'est votre meilleure protection.
          </Typography>
        </Alert>
      </Paper>

      {/* Section 4 */}
      <Paper sx={{ p: 4, mb: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MdSecurity size={32} color="#ffc107" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            4. Lutte contre la fraude
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Bien que nous mettions en place des mécanismes de détection, nous ne pouvons garantir 
          l'absence totale de fraude sur la plateforme.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontWeight: 600 }}>
          En cas de comportement suspect, nous nous réservons le droit de :
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            Suspendre immédiatement un compte
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Supprimer une annonce sans préavis
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Transmettre les informations aux autorités compétentes (Police, BEI, Parquet)
          </Typography>
        </Box>
      </Paper>

      {/* Footer Legal */}
      <Paper 
        sx={{ 
          p: 4, 
          bgcolor: 'grey.900', 
          color: 'white',
          boxShadow: 3
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Acceptation du disclaimer
        </Typography>
        <Typography variant="body1" paragraph>
          En accédant à la plateforme Vente Business BF, vous reconnaissez avoir lu, compris et accepté 
          l'intégralité de ce disclaimer. Vous acceptez toutes les limitations de responsabilité et vous 
          engagez à utiliser le service à vos propres risques.
        </Typography>
        <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
          <strong>Droit applicable :</strong> Code civil burkinabè, Loi 010 2021/AN, Actes Uniformes OHADA. 
          Juridiction compétente : Tribunaux du Burkina Faso.
        </Typography>
      </Paper>
    </Container>
  );
};

export default DisclaimerPage;
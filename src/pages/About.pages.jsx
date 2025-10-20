import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { 
  FaBullseye as TargetIcon,
  FaUsers as UsersIcon,
  FaShieldAlt as ShieldIcon,
  FaHeart as HeartIcon,
  FaCheck as CheckIcon
} from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

export function AboutPage() {
  const theme = useTheme();

  const missionItems = [
    {
      icon: <TargetIcon color="white" size={"24"} />,
      title: "Faciliter les transactions",
      description: "Nous rendons l'achat et la vente d'entreprises simple et accessible à tous les Burkinabè."
    },
    {
      icon: <UsersIcon  color="white" size={"24"}/>,
      title: "Connecter les entrepreneurs", 
      description: "Nous mettons en relation les vendeurs et les acheteurs d'entreprises à travers tout le pays."
    },
    {
      icon: <ShieldIcon color="white" size={"24"} />,
      title: "Garantir la sécurité",
      description: "Nous nous engageons à maintenir une plateforme sûre et transparente pour tous nos utilisateurs."
    },
    {
      icon: <HeartIcon color="white" size={"24"} />,
      title: "Soutenir l'économie locale",
      description: "Nous contribuons au développement économique du Burkina Faso en facilitant la reprise d'entreprises."
    }
  ];

  const advantages = [
    "Plateforme 100% gratuite",
    "Interface simple et intuitive", 
    "Contact direct",
    "Entreprises locales"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Qui nous sommes
        </Typography>
        <Typography variant="h5" color="text.secondary">
          VenteAffaires BF - Votre partenaire de confiance pour l'achat et la vente d'entreprises au Burkina Faso
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
          Notre Mission
        </Typography>
        <Grid container spacing={4}>
          {missionItems.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
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
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          mb: 4, 
          
          bgcolor: theme.palette.success.light,
          '& .MuiTypography-root': {
            color: theme.palette.success.contrastText
          }
        }}
      >
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3,color:"white" }}>
          Pourquoi choisir VenteAffaires BF ?
        </Typography>
        <List>
          {advantages.map((advantage, index) => (
            <ListItem key={index} sx={{ px: 0, color:"white" }} >
              <ListItemIcon>
                <CheckIcon color={"white"} size={"24"} />
              </ListItemIcon>
              <ListItemText 
                primary={advantage}
                
                secondary={
                  index === 0 ? "Publiez et consultez les annonces d'entreprises sans aucun frais." :
                  index === 1 ? "Notre plateforme est conçue pour être utilisée facilement par tout le monde, même sans connaissances techniques." :
                  index === 2 ? "Communiquez directement avec les vendeurs et acheteurs par téléphone pour négocier rapidement." :
                  "Trouvez des opportunités d'affaires dans toutes les régions du Burkina Faso."
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Notre Engagement
        </Typography>
        <Typography variant="h6" sx={{ lineHeight: 1.6 }}>
          Chez VenteAffaires BF, nous croyons que chaque entrepreneur mérite une plateforme simple et efficace 
          pour faire prospérer ses affaires. Nous nous engageons à maintenir cette plateforme accessible, 
          sécurisée et adaptée aux besoins spécifiques du marché burkinabè.
        </Typography>
      </Box>
    </Container>
  );
}

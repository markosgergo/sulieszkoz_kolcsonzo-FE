import { useState, useEffect } from "react";
import { 
  Container, Typography, Box, Button, Grid, Paper, 
  Card, CardContent, CircularProgress, Divider, Stack, Tooltip
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";

// Ikonok
import LoginIcon from '@mui/icons-material/Login';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  
import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

// --- 1. VENDÉG NÉZET (Landing Page) ---
const PublicLanding = () => (
  <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
    <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
      Suli Eszközkölcsönző
    </Typography>
    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto', px: 2 }}>
      Modern és gyors megoldás az iskolai digitális eszközök kezelésére. 
      Regisztrálj, böngészd a készletet és kölcsönözz egyszerűen!
    </Typography>
    
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 8, px: 2 }}>
      <Button variant="contained" size="large" component={Link} to="/login" startIcon={<LoginIcon />} sx={{ px: 4, py: 1.5, borderRadius: 3 }}>
        Bejelentkezés
      </Button>
      <Button variant="outlined" size="large" component={Link} to="/regisztracio" startIcon={<AppRegistrationIcon />} sx={{ px: 4, py: 1.5, borderRadius: 3 }}>
        Regisztráció
      </Button>
    </Stack>

    <Grid container spacing={4} justifyContent="center" sx={{ mt: 4, px: { xs: 2, md: 0 } }}>
      {[
        { icon: <LaptopMacIcon fontSize="large" />, title: "Hatalmas választék", text: "Laptopok, tabletek és projektorok egy helyen a tanuláshoz." },
        { icon: <HistoryIcon fontSize="large" />, title: "Követhető múlt", text: "Bármikor visszanézheted, mit és mikor kölcsönöztél ki." },
        { icon: <AssignmentReturnIcon fontSize="large" />, title: "Egyszerű leadás", text: "Gyors visszavétel és adminisztráció a tanári szobában." }
      ].map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              bgcolor: 'rgba(25, 118, 210, 0.04)', 
              borderRadius: 5,
              height: '100%', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
            <Typography variant="body2" color="text.secondary">{item.text}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// --- 2. DIÁK DASHBOARD (User) ---
const UserDashboard = () => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    ApiService.getSajatKolcsonzesek()
      .then(data => {
        const active = data.filter(k => k.visszavetelDatuma === null).length;
        setActiveCount(active);
      })
      .catch(err => console.error("Hiba:", err));
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Üdvözlünk újra!</Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 4, height: '100%', boxShadow: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Kölcsönzési állapotod</Typography>
              <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>{activeCount} eszköz</Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                {activeCount > 0 
                  ? "Vigyázz az eszközökre és ügyelj a visszahozatali határidőkre!" 
                  : "Jelenleg minden eszközt visszahoztál. Van szükséged valamire?"}
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/sajat-kolcsonzesek" 
                sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                Részletek megtekintése
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'grey.50', border: '1px dashed #ccc' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Új kölcsönzés indítása</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Nézd meg az aktuálisan elérhető készletet és foglald le a tanuláshoz szükséges eszközöket online.
            </Typography>
            <Button variant="outlined" size="large" component={Link} to="/eszkozok" fullWidth sx={{ borderRadius: 2 }}>
              Eszközök böngészése
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// --- 3. ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const [stats, setStats] = useState({ osszes: 0, kint: 0, kesesben: 0, felhasznalok: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eszkozok, kolcsonzesek, felhasznalok] = await Promise.all([
          ApiService.getAllEszkoz(),
          ApiService.getAllKolcsonzes(),
          ApiService.getAllFelhasznalo()
        ]);

        const ma = new Date();
        ma.setHours(0, 0, 0, 0);

        setStats({
          osszes: eszkozok.length,
          kint: kolcsonzesek.filter(k => k.visszavetelDatuma === null).length,
          kesesben: kolcsonzesek.filter(k => k.visszavetelDatuma === null && new Date(k.hatarido) < ma).length,
          felhasznalok: felhasznalok.length
        });
      } catch (err) {
        console.error("Statisztikai hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  const StatKartyak = [
    { label: "Eszközök", value: stats.osszes, color: "#1976d2" },
    { label: "Felhasználók", value: stats.felhasznalok, color: "#4caf50" },
    { label: "Kiadva", value: stats.kint, color: "#ffa000" },
    { label: "Késésben", value: stats.kesesben, color: "#d32f2f" }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Adminisztrációs Vezérlőpult</Typography>
      </Stack>

      <Grid container spacing={3}>
        {StatKartyak.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderTop: `6px solid ${stat.color}`, borderRadius: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {stat.label}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: stat.color }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 6 }} />

      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Gyors elérésű funkciók</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" fullWidth component={Link} to="/admin/kolcsonzesek" startIcon={<HistoryIcon />} sx={{ py: 2 }}>
            Kölcsönzések kezelése
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="outlined" fullWidth component={Link} to="/eszkozok/uj" startIcon={<AddCircleOutlineIcon />} sx={{ py: 2 }}>
            Új eszköz felvitele
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="outlined" fullWidth color="success" component={Link} to="/admin/felhasznalok" startIcon={<GroupIcon />} sx={{ py: 2 }}>
            Felhasználók kezelése
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// --- A FŐ KOMPONENS ---
export default function Home() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ minHeight: '80vh' }}>
      {!user ? (
        <PublicLanding />
      ) : (
        user.szerepkorNev === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />
      )}
    </Container>
  );
}
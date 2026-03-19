import { useState, useEffect } from "react";
import { 
  Container, Typography, Box, Button, Grid, Paper, 
  Card, CardContent, CircularProgress, Divider, Stack 
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService";

// Ikonok
import LoginIcon from '@mui/icons-material/Login';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  

// --- 1. VENDÉG NÉZET (Landing Page) ---
const PublicLanding = () => (
  <Box sx={{ textAlign: 'center', py: { xs: 4, md: 10 } }}>
    <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
      Suli Eszközkölcsönző
    </Typography>
    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
      Modern és gyors megoldás az iskolai digitális eszközök kezelésére. 
      Regisztrálj, böngészd a készletet és kölcsönözz egyszerűen!
    </Typography>
    
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 8 }}>
      <Button variant="contained" size="large" component={Link} to="/login" startIcon={<LoginIcon />} sx={{ px: 4, py: 1.5 }}>
        Bejelentkezés
      </Button>
      <Button variant="outlined" size="large" component={Link} to="/regisztracio" sx={{ px: 4, py: 1.5 }}>
        Regisztráció
      </Button>
    </Stack>

   <Grid 
      container 
      spacing={3} // Kicsit kisebb köz, hogy több hely maradjon a kártyáknak
      justifyContent="center" 
      alignItems="stretch" // Egyforma magasságúak lesznek
      sx={{ mt: 4, px: { xs: 2, md: 0 } }} // Oldalsó margó mobilra
    >
      {[
        { icon: <LaptopMacIcon fontSize="large" />, title: "Hatalmas választék", text: "Laptopok, tabletek és projektorok egy helyen." },
        { icon: <HistoryIcon fontSize="large" />, title: "Követhető múlt", text: "Bármikor visszanézheted, mit és mikor kölcsönöztél." },
        { icon: <AssignmentReturnIcon fontSize="large" />, title: "Egyszerű leadás", text: "Gyors visszavétel az adminisztrátorok segítségével." }
      ].map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, // Kicsit kisebb belső padding
              bgcolor: 'rgba(25, 118, 210, 0.04)', 
              borderRadius: 4,
              height: '100%', // Kitölti a Grid magasságát
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.text}
            </Typography>
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
    ApiService.getSajatKolcsonzesek().then(data => {
      // Csak azokat számoljuk, amik még nincsenek visszahozva
      const active = data.filter(k => k.visszavetelDatuma === null).length;
      setActiveCount(active);
    }).catch(err => console.error("Hiba a saját kölcsönzések lekérésekor:", err));
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      {/* Itt is megjelenítjük a 3 fő kártyát, amit a Landingnél láttunk, 
          hogy egységes legyen a design */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
        {[
          { icon: <LaptopMacIcon fontSize="large" />, title: "Hatalmas választék", text: "Válogass a legújabb eszközeink közül." },
          { icon: <HistoryIcon fontSize="large" />, title: "Követhető múlt", text: "Minden korábbi kölcsönzésed egy helyen." },
          { icon: <AssignmentReturnIcon fontSize="large" />, title: "Egyszerű leadás", text: "Gyors ügyintézés a tanáriban." }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ color: 'primary.main', mb: 1 }}>{item.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">{item.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Személyes státusz szekció */}
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>Jelenlegi állapotod</Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                {activeCount > 0 
                  ? `Jelenleg ${activeCount} eszköz van nálad kölcsönözve.` 
                  : "Jelenleg nincs nálad aktív kölcsönzés."}
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/sajat-kolcsonzesek" 
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                Saját kölcsönzéseim
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Miben segíthetünk?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Böngészd az elérhető eszközök listáját, és találd meg a tanuláshoz szükséges felszerelést.
          </Typography>
          <Button variant="outlined" size="large" component={Link} to="/eszkozok" fullWidth>
            Eszközök böngészése
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// --- 3. ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const [stats, setStats] = useState({ osszes: 0, kint: 0, kesesben: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eszkozok, kolcsonzesek] = await Promise.all([
          ApiService.getAllEszkoz(),
          ApiService.getAllKolcsonzes()
        ]);

        setStats({
          osszes: eszkozok.length,
          kint: kolcsonzesek.filter(k => k.visszavetelDatuma === null).length,
          kesesben: kolcsonzesek.filter(k => k.visszavetelDatuma === null && new Date(k.hatarido) < new Date()).length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Admin Vezérlőpult</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderTop: '6px solid #1976d2', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Összes eszköz</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.osszes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderTop: '6px solid #ffa000', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Kint lévő</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ffa000' }}>{stats.kint}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderTop: '6px solid #d32f2f', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Késésben</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>{stats.kesesben}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Gyors műveletek</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained" component={Link} to="/admin/kolcsonzesek" startIcon={<HistoryIcon />}>
          Kölcsönzések kezelése
        </Button>
        <Button variant="outlined" component={Link} to="/eszkozok/uj" startIcon={<AddCircleOutlineIcon />}>
          Új eszköz felvitele
        </Button>
      </Stack>
    </Box>
  );
};

// --- A FŐ KOMPONENS ---
export default function Home() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      {!user ? (
        <PublicLanding />
      ) : (
        user.szerepkorNev === 'ADMIN' ? <AdminDashboard /> : <UserDashboard user={user} />
      )}
    </Container>
  );
}
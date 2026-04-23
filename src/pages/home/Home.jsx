import { useState, useEffect } from "react";
import { 
  Container, Typography, Box, Button, Grid, Paper, 
  Card, CardContent, CircularProgress, Divider, Stack,
  Modal, Backdrop, Fade
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

import LoginIcon from '@mui/icons-material/Login';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  
import GroupIcon from '@mui/icons-material/Group';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 550 },
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const MainCarousel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState(false);

  const slides = [
    {
      title: "Digitális eszközlista",
      desc: "Minden eszköz egyedi azonosítóval és QR-kóddal rendelkezik a pontos nyilvántartás érdekében.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
      link: "/eszkozok",
      btnText: "Eszközök böngészése",
    },
    {
      title: "QR-kód alapú azonosítás",
      desc: "Gyors és pontos eszközkezelés. Az eszközök kiadása és visszavétele QR-kód beolvasásával történik.",
      image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=1200",
      type: "info",
      btnText: "Hogyan működik?",
    },
    {
      title: "Lejárati figyelmeztetés",
      desc: "Automatikus értesítések a kölcsönzési idő lejárta előtt, hogy elkerüljük az elmaradásokat.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200",
      link: "/sajat-kolcsonzesek",
      btnText: "Határidőim ellenőrzése",
    },
    {
      title: "Kezelői Vezérlőpult",
      desc: "Eszközök gyors kiadása, visszavétele és a késések követése a Kezelők (ADMIN/ALKALMAZOTT) számára.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      showButton: false // Az utolsó dián nincs gomb
    }
  ];

  const handleActionClick = (slide) => {
    if (slide.type === "info") {
      setOpenInfo(true);
      return;
    }
    if (!user) {
      navigate("/login");
    } else {
      navigate(slide.link);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', mb: 6, borderRadius: { xs: 0, md: 4 }, overflow: 'hidden', boxShadow: 3 }}>
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          style={{ "--swiper-navigation-color": "#fff", "--swiper-pagination-color": "#fff" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box sx={{
                height: { xs: '420px', md: '550px' },
                position: 'relative',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', color: 'white', p: { xs: 3, md: 10 }
              }}>
                <Box sx={{ maxWidth: '750px' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '3.6rem' }, lineHeight: 1.1 }}>
                    {slide.title}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 5, fontWeight: 300, opacity: 0.9, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                    {slide.desc}
                  </Typography>
                  
                  {slide.showButton !== false && (
                    <Button 
                      variant="contained" 
                      onClick={() => handleActionClick(slide)}
                      size="large"
                      sx={{ 
                        bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', px: 6, py: 2, borderRadius: 2,
                        '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.02)' }, transition: '0.2s'
                      }}
                    >
                      {slide.btnText}
                    </Button>
                  )}
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* QR INFO MODAL */}
      <Modal open={openInfo} onClose={() => setOpenInfo(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={openInfo}>
          <Box sx={modalStyle}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, color: 'primary.main' }}>
              <QrCodeScannerIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">Hogyan működik?</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              • <strong>Azonosítás:</strong> Minden eszköz egyedi QR-kóddal van ellátva.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              • <strong>Kezelői folyamat:</strong> Az eszközök kiadását és visszavételét az intézmény Kezelői végzik a laborban.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              • <strong>Pontosság:</strong> A QR-kód beolvasásával a rendszer azonnal rögzíti a tranzakciót, elkerülve a kézi adminisztráció hibáit.
            </Typography>
            <Button fullWidth variant="contained" onClick={() => setOpenInfo(false)} sx={{ borderRadius: 2 }}>Értem</Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

const PublicLanding = () => (
  <Box sx={{ pb: 8 }}>
    <MainCarousel />
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>SuliEszköz Kölcsönző</Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {[
          { icon: <NotificationsActiveIcon fontSize="large" />, title: "Lejárati követés", text: "Figyelmeztetések a határidők előtt." },
          { icon: <HistoryIcon fontSize="large" />, title: "Digitális napló", text: "Pontos és visszakereshető kölcsönzési múlt." },
          { icon: <AdminPanelSettingsIcon fontSize="large" />, title: "Szerepkörök", text: "Külön felület kezelőknek és diákoknak." }
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
              <Typography variant="h6" fontWeight="700">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">{item.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 8 }}>
        <Button variant="contained" component={Link} to="/login" startIcon={<LoginIcon />} sx={{ px: 4, borderRadius: 3 }}>Belépés</Button>
        <Button variant="outlined" component={Link} to="/regisztracio" startIcon={<AppRegistrationIcon />} sx={{ px: 4, borderRadius: 3 }}>Regisztráció</Button>
      </Stack>
    </Box>
  </Box>
);

const UserDashboard = () => {
  const [activeCount, setActiveCount] = useState(0);
  useEffect(() => {
    ApiService.getSajatKolcsonzesek()
      .then(data => setActiveCount(data.filter(k => !k.visszavetelDatuma).length))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <MainCarousel />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 5, boxShadow: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold">Aktív kölcsönzéseid</Typography>
              <Typography variant="h2" sx={{ my: 2, fontWeight: 900 }}>{activeCount}</Typography>
              <Button variant="contained" component={Link} to="/sajat-kolcsonzesek" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }}>Kezelés</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '2px dashed #cbd5e1', bgcolor: '#f8fafc' }}>
            <Typography variant="h6" fontWeight="bold">Eszközt keresel?</Typography>
            <Button variant="outlined" component={Link} to="/eszkozok" fullWidth sx={{ mt: 2, borderRadius: 3 }}>Katalógus</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ osszes: 0, kint: 0, kesesben: 0, felhasznalok: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [e, k, f] = await Promise.all([ApiService.getAllEszkoz(), ApiService.getAllKolcsonzes(), ApiService.getAllFelhasznalo()]);
        const ma = new Date(); ma.setHours(0,0,0,0);
        setStats({ osszes: e.length, kint: k.filter(x => !x.visszavetelDatuma).length, kesesben: k.filter(x => !x.visszavetelDatuma && new Date(x.hatarido) < ma).length, felhasznalok: f.length });
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" fontWeight="800">Kezelői Vezérlőpult</Typography>
      </Stack>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { l: "Összes eszköz", v: stats.osszes, c: "#3b82f6" },
          { l: "Regisztráltak", v: stats.felhasznalok, c: "#10b981" },
          { l: "Kölcsönözve", v: stats.kint, c: "#f59e0b" },
          { l: "Késésben", v: stats.kesesben, c: "#ef4444" }
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, borderBottom: `5px solid ${s.c}` }}>
              <Typography variant="caption" fontWeight="800" color="text.secondary">{s.l}</Typography>
              <Typography variant="h4" fontWeight="900" color={s.c}>{s.v}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" component={Link} to="/admin/kolcsonzesek" startIcon={<QrCodeScannerIcon />}>QR Kezelés</Button>
        <Button variant="outlined" component={Link} to="/eszkozok/uj" startIcon={<AddCircleOutlineIcon />}>Új eszköz</Button>
        <Button variant="outlined" color="success" component={Link} to="/admin/felhasznalok" startIcon={<GroupIcon />}>Tagok</Button>
      </Stack>
    </Box>
  );
};

export default function Home() {
  const { user } = useAuth();
  return (
    <Container maxWidth="lg" sx={{ minHeight: '85vh', mt: { xs: 0, md: 4 } }}>
      {!user ? <PublicLanding /> : (user.szerepkorNev === 'ADMIN' || user.szerepkorNev === 'ALKALMAZOTT' ? <AdminDashboard /> : <UserDashboard />)}
    </Container>
  );
}
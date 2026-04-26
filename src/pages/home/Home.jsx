import { useState, useEffect } from "react";
import { 
  Container, Typography, Box, Button, Grid, Paper, 
  Card, CardContent, CircularProgress, Divider, Stack,
  Modal, Backdrop, Fade
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import styles from "./Home.module.css";

// Ikonok
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
      desc: "Eszközök gyors kiadása, visszavétele és a késések követése a Kezelők számára.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      showButton: false
    }
  ];

  return (
    <>
      <Box className={styles.carouselContainer}>
        <Swiper
          spaceBetween={0} centeredSlides={true}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          pagination={{ clickable: true }} navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box 
                className={styles.slide} 
                sx={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${slide.image})` }}
              >
                <Box className={styles.slideContent}>
                  <Typography variant="h3" className={styles.slideTitle}>{slide.title}</Typography>
                  <Typography variant="h6" className={styles.slideDesc}>{slide.desc}</Typography>
                  {slide.showButton !== false && (
                    <Button 
                      variant="contained" 
                      className={styles.whiteButton}
                      onClick={() => slide.type === "info" ? setOpenInfo(true) : (!user ? navigate("/login") : navigate(slide.link))}
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

      <Modal open={openInfo} onClose={() => setOpenInfo(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
        <Fade in={openInfo}>
          <Box className={styles.modalOverlay}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, color: 'primary.main' }}>
              <QrCodeScannerIcon fontSize="large" />
              <Typography variant="h5" fontWeight="bold">Hogyan működik?</Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">• Azonosítás: Egyedi QR-kód minden eszközön.</Typography>
            <Typography variant="body2" color="text.secondary">• Kezelői folyamat: A visszavételt a Kezelők rögzítik.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>• Pontosság: Azonnali, hibamentes rögzítés.</Typography>
            <Button fullWidth variant="contained" onClick={() => setOpenInfo(false)}>Értem</Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

const PublicLanding = () => (
  <Box sx={{ mt: 8, mb: 10 }}>
    <MainCarousel />
    
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h3" className={styles.sectionTitle}>
        SuliEszköz Kölcsönző
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
        Egyszerűsítsd le az iskolai eszközök kezelését digitális platformunkkal. 
        Gyors, pontos és bárhonnan elérhető.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {[
          { icon: <NotificationsActiveIcon fontSize="large" />, title: "Lejárati követés", text: "Automatikus emlékeztetők a határidők előtt." },
          { icon: <HistoryIcon fontSize="large" />, title: "Digitális napló", text: "Visszakereshető kölcsönzési múlt minden eszközhöz." },
          { icon: <AdminPanelSettingsIcon fontSize="large" />, title: "Szerepkörök", text: "Személyre szabott felület diákoknak és tanároknak." }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box className={styles.featureCard}>
              <div className={styles.iconWrapper}>{item.icon}</div>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{item.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {item.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        justifyContent="center" 
        sx={{ mt: 10 }}
      >
        <Button 
          variant="contained" 
          size="large"
          component={Link} 
          to="/login" 
          startIcon={<LoginIcon />}
          className={styles.primaryButton}
        >
          Belépés a rendszerbe
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          component={Link} 
          to="/regisztracio" 
          startIcon={<AppRegistrationIcon />}
          className={styles.secondaryButton}
        >
          Új fiók létrehozása
        </Button>
      </Stack>
    </Box>
  </Box>
);
const UserDashboard = () => {
  const [activeCount, setActiveCount] = useState(0);
  useEffect(() => {
    ApiService.getSajatKolcsonzesek()
      // FIGYELD A FILTER BELSŐ RÉSZÉT:
      .then(data => setActiveCount(data.filter(k => k.statusz === 'KIKOLCSONOZVE').length))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box>
      <MainCarousel />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card className={styles.userCard}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">Aktív kölcsönzéseid</Typography>
              <Typography variant="h2" className={styles.statValue}>{activeCount}</Typography>
              <Button variant="contained" className={styles.whiteButton} component={Link} to="/sajat-kolcsonzesek">Megtekintés</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} className={styles.dashedPaper}>
            <Typography variant="h6" fontWeight="bold">Eszközt keresel?</Typography>
            <Button variant="outlined" component={Link} to="/eszkozok" fullWidth sx={{ mt: 2 }}>Böngészés</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.szerepkorNev === 'ADMIN';
  const [stats, setStats] = useState({ osszes: 0, kint: 0, kesesben: 0, felhasznalok: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const requests = [ApiService.getAllEszkoz(), ApiService.getAllKolcsonzes()];
        if (isAdmin) requests.push(ApiService.getAllFelhasznalo());
        const results = await Promise.all(requests);
        const [e, k] = results;
        const f = isAdmin ? results[2] : [];
        const ma = new Date(); ma.setHours(0,0,0,0);
        
        setStats({ 
          osszes: e.length, 
          
          kint: k.filter(x => x.statusz === 'KIKOLCSONOZVE').length, 
          
          kesesben: k.filter(x => x.statusz === 'KIKOLCSONOZVE' && new Date(x.hatarido) < ma).length, 
          
          felhasznalok: f.length 
        });
        // ----------------------
        
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchStats();
  }, [isAdmin]);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  const statCards = isAdmin
    ? [
        { l: "Összes eszköz", v: stats.osszes, c: "#3b82f6" },
        { l: "Regisztráltak", v: stats.felhasznalok, c: "#10b981" },
        { l: "Kölcsönözve", v: stats.kint, c: "#f59e0b" },
        { l: "Késésben", v: stats.kesesben, c: "#ef4444" }
      ]
    : [
        { l: "Összes eszköz", v: stats.osszes, c: "#3b82f6" },
        { l: "Kölcsönözve", v: stats.kint, c: "#f59e0b" },
        { l: "Késésben", v: stats.kesesben, c: "#ef4444" }
      ];

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <AdminPanelSettingsIcon color="primary" sx={{ fontSize: { xs: 28, md: 40 } }} />
        <Typography variant="h4" fontWeight="800" sx={{ fontSize: { xs: "1.4rem", md: "2.125rem" } }}>Kezelői Vezérlőpult</Typography>
      </Stack>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((s, i) => (
          <Grid item xs={6} md={isAdmin ? 3 : 4} key={i}>
            <Paper className={styles.statPaper} sx={{ borderBottom: `5px solid ${s.c}` }}>
              <Typography variant="caption" fontWeight="800" color="text.secondary">{s.l}</Typography>
              <Typography variant="h4" fontWeight="900" sx={{ color: s.c }}>{s.v}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" component={Link} to="/admin/kolcsonzesek" startIcon={<QrCodeScannerIcon />} fullWidth>QR Kezelés</Button>
        {isAdmin && (
          <>
            <Button variant="outlined" component={Link} to="/eszkozok/uj" startIcon={<AddCircleOutlineIcon />} fullWidth>Új eszköz</Button>
            <Button variant="outlined" color="success" component={Link} to="/admin/felhasznalok" startIcon={<GroupIcon />} fullWidth>Tagok</Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default function Home() {
  const { user } = useAuth();
  return (
    <Container className={styles.mainWrapper} maxWidth="lg">
      {!user ? <PublicLanding /> : (user.szerepkorNev === 'ADMIN' || user.szerepkorNev === 'ALKALMAZOTT' ? <AdminDashboard /> : <UserDashboard />)}
    </Container>
  );
}
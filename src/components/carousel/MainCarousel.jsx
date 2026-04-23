import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
    {
      title: "Digitális oktatás felsőfokon",
      desc: "Kölcsönözz prémium laptopokat és tableteket a tanulmányaidhoz egyetlen kattintással.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
      link: "/eszkozok",
      btnText: "Keresés a készletben"
    },
    {
      title: "Villámgyors QR-visszavétel",
      desc: "Nincs több várakozás! Olvasd be az eszközön lévő QR-kódot, és a rendszer azonnal rögzíti a leadást.",
      image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=1200",
      link: "/sajat-kolcsonzesek",
      btnText: "Hogyan működik?"
    },
    {
      title: "Minden eszközöd egy helyen",
      desc: "Kövesd nyomon a kint lévő eszközeidet és a visszahozatali határidőket a saját profilodban.",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200",
      link: "/sajat-kolcsonzesek",
      btnText: "Kölcsönzéseim"
    },
    {
      title: "Adminisztráció okosan",
      desc: "Részletes statisztikák, késési értesítők és készletkezelés egy modern felületen keresztül.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      link: "/admin/kolcsonzesek",
      btnText: "Adminisztrációs központ"
    }
  ];

export default function MainCarousel() {
  return (
    <Box sx={{ width: '100%', mb: 6, borderRadius: { xs: 0, md: 4 }, overflow: 'hidden' }}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box sx={{
              height: { xs: '400px', md: '500px' },
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              textAlign: 'left'
            }}>
              <Container maxWidth="lg">
                <Box sx={{ maxWidth: '600px', p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                    {slide.title}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
                    {slide.desc}
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to={slide.link}
                    size="large"
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      '&:hover': { bgcolor: '#f0f0f0' }
                    }}
                  >
                    {slide.btnText}
                  </Button>
                </Box>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
import { Container, Paper, Typography, Box, Avatar, Divider, Grid, Chip, Button, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LockResetIcon from "@mui/icons-material/LockReset";

// CSS Modul import
import styles from "./Profil.module.css";

export default function Profil() {
  const { user } = useAuth();

  if (!user) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary">Nincs bejelentkezett felhasználó.</Typography>
    </Box>
  );

  const isAdmin = user.szerepkorNev === "ADMIN";

  return (
    <Container maxWidth="sm" className={styles.container} sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={0} className={styles.profilePaper}>
        
        {/* Dekorációs fejléc rész */}
        <Box className={styles.headerDecoration} />

        <Box sx={{ p: 4, mt: -7, textAlign: 'center' }}>
          {/* Avatar */}
          <Avatar 
            className={styles.avatar}
            sx={{ 
              width: 120, height: 120, mx: 'auto', mb: 2, 
              bgcolor: isAdmin ? 'error.main' : 'secondary.main', 
              border: '6px solid white', 
              fontSize: '3rem',
              fontWeight: 'bold'
            }}
          >
            {user.nev?.charAt(0) || "U"}
          </Avatar>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            {user.nev}
          </Typography>

          <Chip 
            label={isAdmin ? "Rendszergazda" : "Felhasználó"} 
            color={isAdmin ? "error" : "primary"} 
            sx={{ 
                mb: 4, 
                fontWeight: 700, 
                borderRadius: '8px',
                px: 2
            }} 
          />

          <Divider sx={{ mb: 4, opacity: 0.6 }} />

          {/* Adatok listája */}
          <Stack spacing={1}>
            <Box className={styles.infoRow}>
              <Grid container alignItems="center">
                <Grid item xs={2} sm={1}>
                  <EmailIcon sx={{ color: '#64748b' }} />
                </Grid>
                <Grid item xs={10} sm={11} sx={{ textAlign: 'left', pl: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">E-mail cím</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.email || "Nincs megadva"}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box className={styles.infoRow}>
              <Grid container alignItems="center">
                <Grid item xs={2} sm={1}>
                  <BadgeIcon sx={{ color: '#64748b' }} />
                </Grid>
                <Grid item xs={10} sm={11} sx={{ textAlign: 'left', pl: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Felhasználóazonosító</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>#{user.id}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box className={styles.infoRow}>
              <Grid container alignItems="center">
                <Grid item xs={2} sm={1}>
                  <PersonIcon sx={{ color: '#64748b' }} />
                </Grid>
                <Grid item xs={10} sm={11} sx={{ textAlign: 'left', pl: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Hozzáférés szintje</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {isAdmin ? "Teljes körű adminisztráció" : "Általános felhasználói jogok"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Stack>

          <Divider sx={{ my: 4, opacity: 0.6 }} />

          {/* Műveletek */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="inherit"
              className={styles.actionButton}
              startIcon={<LockResetIcon />}
              onClick={() => alert("Ez a funkció fejlesztés alatt áll. Kérlek, fordulj a rendszergazdához!")}
              sx={{ bgcolor: '#f1f5f9', color: '#475569', '&:hover': { bgcolor: '#e2e8f0' } }}
            >
              Jelszó módosítása
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
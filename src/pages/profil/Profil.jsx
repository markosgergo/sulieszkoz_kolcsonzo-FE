import { Container, Paper, Typography, Box, Avatar, Divider, Grid, Chip, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function Profil() {
  const { user } = useAuth();

  if (!user) return <Typography align="center" sx={{ mt: 5 }}>Nincs bejelentkezett felhasználó.</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center', position: 'relative' }}>
        
        {/* Dekorációs fejléc rész */}
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px', 
          bgcolor: 'primary.main', borderRadius: '12px 12px 0 0', zIndex: 0 
        }} />

        {/* Avatar */}
        <Avatar 
          sx={{ 
            width: 100, height: 100, mx: 'auto', mb: 2, 
            bgcolor: 'secondary.main', border: '4px solid white', 
            position: 'relative', zIndex: 1, fontSize: '2.5rem'
          }}
        >
          {user.nev?.charAt(0) || "U"}
        </Avatar>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {user.nev}
        </Typography>

        <Chip 
          label={user.szerepkorNev || user.role || "Felhasználó"} 
          color={user.szerepkorNev === "ADMIN" ? "error" : "primary"} 
          sx={{ mb: 3, fontWeight: 'bold' }} 
        />

        <Divider sx={{ mb: 3 }} />

        {/* Adatok listája - Kijavított Grid (nincs "item" prop) */}
        <Grid container spacing={3} sx={{ textAlign: 'left' }}>
          <Grid xs={12} display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">E-mail cím</Typography>
              <Typography variant="body1">{user.email || "Nincs megadva"}</Typography>
            </Box>
          </Grid>

          <Grid xs={12} display="flex" alignItems="center">
            <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Felhasználóazonosító (ID)</Typography>
              <Typography variant="body1">#{user.id}</Typography>
            </Box>
          </Grid>

          <Grid xs={12} display="flex" alignItems="center">
            <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Szerepkör</Typography>
              <Typography variant="body1">{user.szerepkorNev === "ADMIN" ? "Rendszergazda" : "Diák / Felhasználó"}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Műveletek */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<LockResetIcon />}
            onClick={() => alert("Ez a funkció fejlesztés alatt áll. Kérlek, fordulj a rendszergazdához!")}
          >
            Jelszó módosítása
          </Button>
        </Box>

      </Paper>
    </Container>
  );
}
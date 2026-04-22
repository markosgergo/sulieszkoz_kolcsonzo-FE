import { useState } from "react";
import { 
  Container, Paper, Typography, Box, Avatar, Divider, Grid, Chip, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, InputAdornment, IconButton
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApiService from "../../services/ApiService";
import styles from "./Profil.module.css";

export default function Profil() {
  const { user } = useAuth();
  
  const [openJelszoDialog, setOpenJelszoDialog] = useState(false);
  const [regiJelszo, setRegiJelszo] = useState("");
  const [ujJelszo, setUjJelszo] = useState("");
  const [ujJelszoMegerosites, setUjJelszoMegerosites] = useState("");
  const [hibaUzenet, setHibaUzenet] = useState("");
  const [sikerUzenet, setSikerUzenet] = useState("");
  const [loading, setLoading] = useState(false);

  const [showRegi, setShowRegi] = useState(false);
  const [showUj, setShowUj] = useState(false);
  const [showMegerosites, setShowMegerosites] = useState(false);

  if (!user) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary">Nincs bejelentkezett felhasználó.</Typography>
    </Box>
  );

  const isAdmin = user.szerepkorNev === "ADMIN";
  const isAlkalmazott = user.szerepkorNev === "ALKALMAZOTT";

  const handleDialogClose = () => {
    if (loading) return;
    setOpenJelszoDialog(false);
    setRegiJelszo("");
    setUjJelszo("");
    setUjJelszoMegerosites("");
    setHibaUzenet("");
    setSikerUzenet("");
    setShowRegi(false);
    setShowUj(false);
    setShowMegerosites(false);
  };

  const validate = () => {
    if (!regiJelszo) return "A jelenlegi jelszó megadása kötelező.";
    if (!ujJelszo) return "Az új jelszó megadása kötelező.";
    if (ujJelszo.length < 6) return "Az új jelszónak legalább 6 karakter hosszúnak kell lennie.";
    if (ujJelszo !== ujJelszoMegerosites) return "Az új jelszó és a megerősítés nem egyezik.";
    if (regiJelszo === ujJelszo) return "Az új jelszó nem egyezhet meg a régivel.";
    return null;
  };

  const handleJelszoModositas = async () => {
    setHibaUzenet("");
    setSikerUzenet("");

    const validaciosHiba = validate();
    if (validaciosHiba) {
      setHibaUzenet(validaciosHiba);
      return;
    }

    setLoading(true);
    try {
      await ApiService.modositJelszo(user.id, { regiJelszo, ujJelszo });
      setSikerUzenet("A jelszó sikeresen módosítva!");
      setTimeout(() => {
        handleDialogClose();
      }, 1800);
    } catch (err) {
      setHibaUzenet(
        err.response?.data?.hiba ||
        err.response?.data?.message ||
        "Hiba történt a jelszó módosításakor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container} sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={0} className={styles.profilePaper}>
        <Box className={styles.headerDecoration} />

        <Box sx={{ p: 4, mt: -7, textAlign: 'center' }}>
          <Avatar 
            className={styles.avatar}
            sx={{ 
              width: 120, height: 120, mx: 'auto', mb: 2, 
              bgcolor: isAdmin ? 'error.main' : isAlkalmazott ? 'info.main' : 'secondary.main', 
              border: '6px solid white', fontSize: '3rem', fontWeight: 'bold'
            }}
          >
            {user.nev?.charAt(0) || "U"}
          </Avatar>

          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>{user.nev}</Typography>

          <Chip 
            label={isAdmin ? "Rendszergazda" : isAlkalmazott ? "Alkalmazott" : "Felhasználó"} 
            color={isAdmin ? "error" : isAlkalmazott ? "info" : "primary"} 
            sx={{ mb: 4, fontWeight: 700, borderRadius: '8px', px: 2 }} 
          />

          <Divider sx={{ mb: 4, opacity: 0.6 }} />

          <Stack spacing={1}>
            <Box className={styles.infoRow}>
              <Grid container alignItems="center">
                <Grid item xs={2} sm={1}><EmailIcon sx={{ color: '#64748b' }} /></Grid>
                <Grid item xs={10} sm={11} sx={{ textAlign: 'left', pl: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">E-mail cím</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.email || "Nincs megadva"}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box className={styles.infoRow}>
              <Grid container alignItems="center">
                <Grid item xs={2} sm={1}><BadgeIcon sx={{ color: '#64748b' }} /></Grid>
                <Grid item xs={10} sm={11} sx={{ textAlign: 'left', pl: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Felhasználóazonosító</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>#{user.id}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Stack>

          <Divider sx={{ my: 4, opacity: 0.6 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" color="inherit" className={styles.actionButton} startIcon={<LockResetIcon />}
              onClick={() => setOpenJelszoDialog(true)}
              sx={{ bgcolor: '#f1f5f9', color: '#475569', '&:hover': { bgcolor: '#e2e8f0' } }}
            >
              Jelszó módosítása
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={openJelszoDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Jelszó módosítása</DialogTitle>
        <DialogContent>
          {hibaUzenet && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{hibaUzenet}</Alert>}
          {sikerUzenet && <Alert severity="success" sx={{ mb: 2, mt: 1 }}>{sikerUzenet}</Alert>}
          
          <TextField
            margin="dense"
            label="Jelenlegi jelszó"
            type={showRegi ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={regiJelszo}
            onChange={(e) => setRegiJelszo(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowRegi(!showRegi)} edge="end" size="small">
                    {showRegi ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            margin="dense"
            label="Új jelszó"
            type={showUj ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={ujJelszo}
            onChange={(e) => setUjJelszo(e.target.value)}
            disabled={loading}
            helperText="Legalább 6 karakter"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowUj(!showUj)} edge="end" size="small">
                    {showUj ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            margin="dense"
            label="Új jelszó megerősítése"
            type={showMegerosites ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={ujJelszoMegerosites}
            onChange={(e) => setUjJelszoMegerosites(e.target.value)}
            disabled={loading}
            error={ujJelszoMegerosites.length > 0 && ujJelszo !== ujJelszoMegerosites}
            helperText={
              ujJelszoMegerosites.length > 0 && ujJelszo !== ujJelszoMegerosites
                ? "A jelszavak nem egyeznek"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowMegerosites(!showMegerosites)} edge="end" size="small">
                    {showMegerosites ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDialogClose} color="inherit" disabled={loading}>
            Mégse
          </Button>
          <Button onClick={handleJelszoModositas} variant="contained" color="primary" disabled={loading}>
            {loading ? "Mentés..." : "Mentés"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

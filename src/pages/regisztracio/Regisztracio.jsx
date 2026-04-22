import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { 
  Container, Paper, TextField, Button, Typography, Stack, 
  Box, InputAdornment, IconButton 
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from "./Regisztracio.module.css";

export default function Regisztracio() {
  const [urlapAdatok, setUrlapAdatok] = useState({
    nev: "",
    email: "",
    jelszo: "",
    szerepkorNev: "FELHASZNALO"
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.register(urlapAdatok);
      alert("Sikeres regisztráció! Most már bejelentkezhetsz.");
      navigate("/login");
    } catch (error) {
      alert("Hiba a regisztráció során! Ellenőrizd az adatokat (min. 6 karakteres jelszó).");
    }
  };

  return (
    <Box className={styles.pageWrapper}>
      <Container maxWidth="xs" className={styles.regContainer}>
        <Paper className={styles.regPaper} elevation={0}>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                p: 2, 
                borderRadius: '50%', 
                bgcolor: '#ecfdf5', 
                color: '#10b981',
                mb: 2
              }}
            >
              <PersonAddIcon fontSize="large" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Regisztráció
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hozza létre saját fiókját pár másodperc alatt
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Teljes név"
                value={urlapAdatok.nev}
                onChange={(e) => setUrlapAdatok({...urlapAdatok, nev: e.target.value})}
                fullWidth required
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label="Email cím"
                type="email"
                value={urlapAdatok.email}
                onChange={(e) => setUrlapAdatok({...urlapAdatok, email: e.target.value})}
                fullWidth required
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label="Jelszó (min. 6 karakter)"
                type={showPassword ? "text" : "password"}
                value={urlapAdatok.jelszo}
                onChange={(e) => setUrlapAdatok({...urlapAdatok, jelszo: e.target.value})}
                fullWidth required
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ pt: 1 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  className={styles.regButton}
                >
                  Fiók létrehozása
                </Button>
                
                <Button 
                  onClick={() => navigate("/login")} 
                  variant="text" 
                  fullWidth 
                  className={styles.backButton}
                  sx={{ mt: 1 }}
                >
                  Már van fiókom, belépek
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
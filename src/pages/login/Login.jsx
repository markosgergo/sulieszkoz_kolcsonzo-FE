import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Paper, TextField, Button, Typography, Stack, Box, InputAdornment } from "@mui/material";

// Ikonok a profibb kinézethez
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';

// CSS Modul import
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); 
      navigate("/eszkozok"); 
    } catch (error) {
      console.error("Login hiba:", error);
      alert("Hibás email vagy jelszó!");
    }
  };

  return (
    <Box className={styles.pageWrapper}>
      <Container maxWidth="xs" className={styles.loginContainer}>
        <Paper className={styles.loginPaper} elevation={0}>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
                sx={{ 
                    display: 'inline-flex', 
                    p: 1.5, 
                    borderRadius: '16px', 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    mb: 2,
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                }}
            >
                <LoginIcon fontSize="large" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Üdvözöljük!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kérjük, jelentkezzen be a folytatáshoz
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email cím"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Jelszó"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth
                className={styles.loginButton}
              >
                Bejelentkezés
              </Button>

              <Typography variant="caption" align="center" sx={{ color: 'text.disabled', mt: 2 }}>
                © 2026 Eszközkezelő Rendszer v1.0
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
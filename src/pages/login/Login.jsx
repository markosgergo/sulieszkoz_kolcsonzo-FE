import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Paper, TextField, Button, Typography, Stack, Box, InputAdornment, Alert } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [hiba, setHiba] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHiba("");
    setLoading(true);
    try {
      await login(email, jelszo);
      navigate("/");
    } catch (err) {
      setHiba(err.response?.data?.hiba || "Hibás e-mail cím vagy jelszó!");
    } finally {
      setLoading(false);
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

          {hiba && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {hiba}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email cím"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                disabled={loading}
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
                value={jelszo}
                onChange={(e) => setJelszo(e.target.value)}
                fullWidth
                required
                disabled={loading}
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
                disabled={loading}
                className={styles.loginButton}
              >
                {loading ? "Bejelentkezés..." : "Bejelentkezés"}
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

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Paper, TextField, Button, Typography, Stack } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Itt most NEM az ApiService-t hívjuk, hanem a Context mock loginját
      await login(email, password); 
      
      // Ha a Context-ben átírtad a logint, ahogy javasoltam, 
      // akkor ez most beállítja a user-t és mehetünk tovább.
      navigate("/eszkozok");
    } catch (error) {
      alert("Hiba a bejelentkezés során!");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Bejelentkezés</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Jelszó"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large">
              Belépés
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
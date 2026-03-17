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
      // Ez hívja meg az AuthContext login-ját, ami hívja az ApiService-t
      await login(email, password); 
      
      // Ha nem dobott hibát, akkor a token mentése és a user beállítása megtörtént
      console.log("Sikeres bejelentkezés!");
      navigate("/eszkozok"); // Átirányítás
    } catch (error) {
      console.error("Login hiba:", error);
      alert("Hibás email vagy jelszó!");
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
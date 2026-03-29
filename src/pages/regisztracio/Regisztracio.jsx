import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { Container, Paper, TextField, Button, Typography, Stack } from "@mui/material";

export default function Regisztracio() {
    const [urlapAdatok, setUrlapAdatok] = useState({
    nev: "",
    email: "",
    jelszo: "",
    szerepkorNev: "FELHASZNALO" // Itt "USER" volt, írd át "FELHASZNALO"-ra!
    });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Most már pontosan azt küldjük, amit a FelhasznaloLetrehozoDTO vár
      await ApiService.register(urlapAdatok);
      alert("Sikeres regisztráció! Most már bejelentkezhetsz.");
      navigate("/login");
    } catch (error) {
      // Ha a backend validációs hibát dob (pl. rövid jelszó), itt elkapjuk
      alert("Hiba a regisztráció során! Ellenőrizd az adatokat (min. 6 karakteres jelszó).");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Új fiók létrehozása</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Teljes név"
              value={urlapAdatok.nev}
              onChange={(e) => setUrlapAdatok({...urlapAdatok, nev: e.target.value})}
              fullWidth required
            />
            <TextField
              label="Email cím"
              type="email"
              value={urlapAdatok.email}
              onChange={(e) => setUrlapAdatok({...urlapAdatok, email: e.target.value})}
              fullWidth required
            />
            <TextField
              label="Jelszó (min. 6 karakter)"
              type="password"
              value={urlapAdatok.jelszo}
              onChange={(e) => setUrlapAdatok({...urlapAdatok, jelszo: e.target.value})}
              fullWidth required
            />
            {/* A szerepkorNev-et elrejtjük, alapból USER lesz */}
            <Button type="submit" variant="contained" color="success" size="large">
              Regisztrálok
            </Button>
            <Button onClick={() => navigate("/login")} variant="text">
              Vissza a belépéshez
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
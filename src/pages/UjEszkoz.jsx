import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importáljuk a navigációt
import ApiService from "../services/ApiService"; // Importáljuk a szervizt
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert
} from "@mui/material";

export default function UjEszkoz() {
  const [nev, setNev] = useState("");
  const [tipus, setTipus] = useState("");
  const [sku, setSku] = useState("");
  const [hiba, setHiba] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHiba(""); // Előző hiba törlése

    const ujEszkoz = {
      nev,
      tipus,
      sku,
      elerheto: true // Alapértelmezetten legyen elérhető az új eszköz
    };

    try {
      // Éles hívás a backend felé
      await ApiService.createEszkoz(ujEszkoz);
      
      alert("Eszköz sikeresen hozzáadva!");
      
      // Visszaviszünk a listához, hogy lássuk az eredményt
      navigate("/eszkozok"); 
    } catch (error) {
      console.error("Hiba az eszköz mentésekor:", error);
      setHiba("Nem sikerült elmenteni az eszközt. Ellenőrizd a csatlakozást!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Új eszköz hozzáadása
        </Typography>

        {hiba && <Alert severity="error" sx={{ mb: 2 }}>{hiba}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Eszköz neve"
              value={nev}
              onChange={(e) => setNev(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Típus"
              value={tipus}
              onChange={(e) => setTipus(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="SKU (Egyedi azonosító)"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
            >
              Mentés az adatbázisba
            </Button>
            
            <Button 
              variant="text" 
              onClick={() => navigate("/eszkozok")}
            >
              Mégse
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
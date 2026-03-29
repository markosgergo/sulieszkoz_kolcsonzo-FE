import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  MenuItem,
  Box,
  Divider
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function UjEszkoz() {
  const [nev, setNev] = useState("");
  const [tipus, setTipus] = useState("laptop"); // Alapértelmezett érték
  const [sku, setSku] = useState("");
  const [leiras, setLeiras] = useState(""); // Itt az új mezőnk!
  const [hiba, setHiba] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHiba("");
    setLoading(true);

    const ujEszkoz = {
      nev,
      tipus: tipus.toLowerCase(), // Konzisztencia a szűrés miatt
      sku,
      leiras, // Küldjük a leírást is
      elerheto: true 
    };

    try {
      await ApiService.createEszkoz(ujEszkoz);
      navigate("/eszkozok"); 
    } catch (error) {
      console.error("Hiba az eszköz mentésekor:", error);
      setHiba("Nem sikerült elmenteni az eszközt. Lehet, hogy már létezik ilyen SKU?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
          Új eszköz
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Töltsd ki az alábbi adatokat az eszköz regisztrálásához.
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {hiba && <Alert severity="error" sx={{ mb: 2 }}>{hiba}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Eszköz teljes neve"
              placeholder="pl. Asus Zenbook UX430"
              value={nev}
              onChange={(e) => setNev(e.target.value)}
              required
              fullWidth
            />

            <TextField
              select
              label="Eszköz típusa"
              value={tipus}
              onChange={(e) => setTipus(e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="laptop">Laptop</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
              <MenuItem value="telefon">Telefon</MenuItem>
              <MenuItem value="projektor">Projektor</MenuItem>
              <MenuItem value="egyéb">Egyéb</MenuItem>
            </TextField>

            <TextField
              label="SKU / Leltári szám"
              placeholder="pl. SULI-LP-001"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Részletes leírás"
              placeholder="Processzor, RAM, tartozékok, fizikai állapot..."
              value={leiras}
              onChange={(e) => setLeiras(e.target.value)}
              multiline
              rows={4}
              fullWidth
              helperText="Minden fontos technikai adatot ide írj."
            />

            <Box sx={{ pt: 2 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ borderRadius: 2, py: 1.2 }}
                >
                  {loading ? "Mentés..." : "Eszköz mentése"}
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="inherit"
                  fullWidth
                  onClick={() => navigate("/eszkozok")}
                  startIcon={<CancelIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Mégse
                </Button>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
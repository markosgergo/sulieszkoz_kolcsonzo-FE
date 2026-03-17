import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import { useAuth } from "../context/AuthContext"; // Szükséges a bejelentkezett user adataihoz
import { 
  Container, Paper, Typography, TextField, Button, Stack, Alert, Box, CircularProgress 
} from "@mui/material";

export default function Kolcsonzes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Itt érjük el a bejelentkezett felhasználót
  
  const [eszkoz, setEszkoz] = useState(null);
  const [napok, setNapok] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

  // 1. Eszköz adatainak lekérése betöltéskor
  useEffect(() => {
    const fetchEszkoz = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getEszkozById(id);
        setEszkoz(data);
      } catch (err) {
        setHiba("Az eszköz nem található.");
      } finally {
        setLoading(false);
      }
    };
    fetchEszkoz();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHiba("");

    try {
      // 2. Határidő kiszámítása (ma + X nap)
      const maiDatum = new Date();
      maiDatum.setDate(maiDatum.getDate() + parseInt(napok));
      const hataridoFormazva = maiDatum.toISOString().split('T')[0]; // YYYY-MM-DD formátum

      // 3. Adatok összeállítása a Backend elvárásai szerint
      // A logok alapján: felhasznaloId, kiadoId és hatarido kötelező!
      const kolcsonzesAdat = {
        eszkozId: parseInt(id),
        felhasznaloId: user?.felhasznaloId || user?.id, // Attól függően, mi a mezőneve a user objektumban
        kiadoId: user?.felhasznaloId || user?.id,       // Mivel te vagy belépve, te vagy a kiadó is
        hatarido: hataridoFormazva
      };

      await ApiService.createKolcsonzes(kolcsonzesAdat);
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/eszkozok");
      }, 2000);
    } catch (err) {
      console.error("Kölcsönzési hiba:", err);
      // Ha a backend küld hibaüzenetet, azt írjuk ki, egyébként egy általánosat
      setHiba(err.response?.data?.message || "Hiba történt a mentés során. Ellenőrizd az adatokat!");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kölcsönzés rögzítése
        </Typography>
        
        {eszkoz && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle1"><b>Eszköz:</b> {eszkoz.nev}</Typography>
            <Typography variant="subtitle1"><b>Típus:</b> {eszkoz.tipus}</Typography>
            <Typography variant="subtitle1"><b>Azonosító:</b> #{id}</Typography>
          </Box>
        )}

        {success ? (
          <Alert severity="success">
            Sikeres kölcsönzés! Visszairányítás a listához...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {hiba && <Alert severity="error">{hiba}</Alert>}
              
              <TextField
                label="Hány napra veszed ki?"
                type="number"
                value={napok}
                onChange={(e) => setNapok(e.target.value)}
                inputProps={{ min: 1, max: 14 }}
                fullWidth
                required
                helperText="Maximum 14 napra kölcsönözhető."
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                fullWidth
              >
                Kölcsönzés indítása
              </Button>
              
              <Button 
                variant="text" 
                onClick={() => navigate("/eszkozok")}
              >
                Mégse
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useAuth } from "../../context/AuthContext";
import { 
  Container, Paper, Typography, TextField, Button, Stack, 
  Alert, Box, CircularProgress, MenuItem 
} from "@mui/material";

export default function Kolcsonzes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [eszkoz, setEszkoz] = useState(null);
  const [felhasznalok, setFelhasznalok] = useState([]);
  const [targetUserId, setTargetUserId] = useState("");
  const [napok, setNapok] = useState(7); 
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fontos: Itt az ApiService.getAllFelhasznalo()-t hívjuk, mert az van az ApiService.js-edben!
        const [eszkozAdat, userek] = await Promise.all([
          ApiService.getEszkozById(id),
          ApiService.getAllFelhasznalo() 
        ]);
        setEszkoz(eszkozAdat);
        setFelhasznalok(userek);
      } catch (err) {
        console.error("Adatbetöltési hiba:", err);
        setHiba("Nem sikerült betölteni az adatokat. Ellenőrizd a hálózatot!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHiba("");

    if (!targetUserId) {
      setHiba("Kérlek, válassz ki egy felhasználót!");
      return;
    }

    try {
      // Dátum számítása: Ma + napok száma
      const celDatum = new Date();
      celDatum.setDate(celDatum.getDate() + parseInt(napok));
      
      // ISO dátum formátum (YYYY-MM-DD), amit a LocalDate vár
      const hataridoFormazva = celDatum.toISOString().split('T')[0];

      // Összeállítás a KolcsonzesLetrehozoDTO szerint
      const kolcsonzesAdat = {
        felhasznaloId: Number(targetUserId),
        eszkozId: Number(id),
        kiadoId: Number(user?.id || user?.felhasznaloId),
        hatarido: hataridoFormazva
      };

      console.log("Küldés folyamatban:", kolcsonzesAdat);

      await ApiService.createKolcsonzes(kolcsonzesAdat);
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/eszkozok");
      }, 2000);
    } catch (err) {
      console.error("Backend hibaüzenet:", err.response?.data);
      
      // Ha a backend küldött részletes hibaobjektumot (pl. validációs hiba)
      const szerverUzenet = err.response?.data?.message || "Hiba történt a mentés során.";
      const validaciosHibak = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).join(", ") 
        : "";

      setHiba(validaciosHibak ? `${szerverUzenet}: ${validaciosHibak}` : szerverUzenet);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
          Kölcsönzés rögzítése
        </Typography>
        
        {eszkoz && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, borderLeft: '5px solid #1976d2' }}>
            <Typography variant="subtitle1"><b>Eszköz:</b> {eszkoz.nev}</Typography>
            <Typography variant="subtitle1"><b>Típus:</b> {eszkoz.tipus}</Typography>
            <Typography variant="subtitle2" color="text.secondary">Leltári szám: {eszkoz.sku || id}</Typography>
          </Box>
        )}

        {success ? (
          <Alert severity="success" sx={{ py: 2, fontSize: '1.1rem' }}>
            Sikeres mentés! Az eszköz állapota "Kiadva" lett.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {hiba && <Alert severity="error">{hiba}</Alert>}
              
              <TextField
                select
                label="Kölcsönző személy"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required
                fullWidth
              >
                {felhasznalok.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.vezeteknev} {f.keresztnev} ({f.email})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Kölcsönzés hossza (nap)"
                type="number"
                value={napok}
                onChange={(e) => setNapok(e.target.value)}
                inputProps={{ min: 1, max: 30 }}
                fullWidth
                required
                helperText="A határidőnek a jövőben kell lennie."
              />
              
              <Box sx={{ pt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  fullWidth
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  Kiadás jóváhagyása
                </Button>
                
                <Button 
                  variant="text" 
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate("/eszkozok")}
                >
                  Mégse
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
}
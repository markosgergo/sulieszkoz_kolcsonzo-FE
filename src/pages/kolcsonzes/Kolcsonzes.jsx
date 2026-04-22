import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useAuth } from "../../context/AuthContext";
import { 
  Container, Paper, Typography, TextField, Button, Stack, 
  Alert, Box, CircularProgress, MenuItem 
} from "@mui/material";
import styles from "./Kolcsonzes.module.css";
import DevicesIcon from '@mui/icons-material/Devices';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

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
        const [eszkozAdat, userek] = await Promise.all([
          ApiService.getEszkozById(id),
          ApiService.getAllFelhasznalo() 
        ]);
        setEszkoz(eszkozAdat);
        setFelhasznalok(userek);
      } catch (err) {
        setHiba("Nem sikerült betölteni az adatokat.");
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
      const celDatum = new Date();
      celDatum.setDate(celDatum.getDate() + parseInt(napok));
      const hataridoFormazva = celDatum.toISOString().split('T')[0];

      const kolcsonzesAdat = {
        felhasznaloId: Number(targetUserId),
        eszkozId: Number(id),
        kiadoId: Number(user?.id || user?.felhasznaloId),
        hatarido: hataridoFormazva
      };

      await ApiService.createKolcsonzes(kolcsonzesAdat);
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/eszkozok");
      }, 2000);
    } catch (err) {
      setHiba(err.response?.data?.message || "Hiba történt a mentés során.");
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress thickness={5} size={60} />
    </Box>
  );

  return (
    <Container maxWidth="sm" className={styles.container} sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={0} className={styles.paper} sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Kölcsönzés
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Töltse ki az adatokat az eszköz kiadásához
            </Typography>
        </Stack>
        
        {eszkoz && (
          <Box className={styles.eszkozInfo} sx={{ mb: 4, p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <DevicesIcon sx={{ color: '#3b82f6' }} />
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a8a', lineHeight: 1.2 }}>
                        {eszkoz.nev}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {eszkoz.tipus} • {eszkoz.sku || `#${id}`}
                    </Typography>
                </Box>
            </Stack>
          </Box>
        )}

        {success ? (
          <Alert 
            severity="success" 
            variant="filled"
            icon={<EventAvailableIcon fontSize="inherit" />}
            sx={{ py: 3, borderRadius: '12px', fontSize: '1rem' }}
          >
            Sikeres rögzítés! Átirányítás...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {hiba && <Alert severity="error" sx={{ borderRadius: '10px' }}>{hiba}</Alert>}
              
              <TextField
                select
                label="Ki kölcsönzi ki?"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required
                fullWidth
                className={styles.textField}
              >
                {felhasznalok.map((f) => (
                  <MenuItem key={f.id || f.felhasznaloId} value={f.id || f.felhasznaloId}>
                    {f.nev || `${f.vezeteknev} ${f.keresztnev}`} ({f.email})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Időtartam (napok száma)"
                type="number"
                value={napok}
                onChange={(e) => setNapok(e.target.value)}
                inputProps={{ min: 1, max: 90 }}
                fullWidth
                required
                className={styles.textField}
                helperText="Hány napig maradjon a felhasználónál?"
              />
              
              <Box sx={{ pt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  fullWidth
                  className={styles.submitButton}
                  sx={{ py: 2 }}
                >
                  Eszköz kiadása
                </Button>
                
                <Button 
                  variant="text" 
                  fullWidth
                  className={styles.cancelButton}
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/eszkozok")}
                >
                  Mégse és vissza
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
}
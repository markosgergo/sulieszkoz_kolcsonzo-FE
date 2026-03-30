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
  Divider,
  InputAdornment
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import QrCodeIcon from '@mui/icons-material/QrCode';

// CSS Modul import
import styles from "./UjEszkoz.module.css";

export default function UjEszkoz() {
  const [nev, setNev] = useState("");
  const [tipus, setTipus] = useState("laptop");
  const [sku, setSku] = useState("");
  const [leiras, setLeiras] = useState("");
  const [hiba, setHiba] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHiba("");
    setLoading(true);

    const ujEszkoz = {
      nev,
      tipus: tipus.toLowerCase(),
      sku,
      leiras,
      elerheto: true 
    };

    try {
      await ApiService.createEszkoz(ujEszkoz);
      navigate("/eszkozok"); 
    } catch (error) {
      setHiba("Nem sikerült elmenteni az eszközt. Lehet, hogy már létezik ilyen SKU?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container} sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={0} className={styles.formPaper} sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1.5 }}>
          <InventoryIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Új eszköz
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Adja meg a leltári adatokat és a technikai paramétereket.
        </Typography>
        
        <Divider sx={{ mb: 4, opacity: 0.6 }} />

        {hiba && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{hiba}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Eszköz teljes neve"
              placeholder="pl. Asus Zenbook UX430"
              value={nev}
              onChange={(e) => setNev(e.target.value)}
              required
              fullWidth
              className={styles.textField}
            />

            <TextField
              select
              label="Eszköz típusa"
              value={tipus}
              onChange={(e) => setTipus(e.target.value)}
              required
              fullWidth
              className={styles.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
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
              className={styles.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Részletes leírás"
              placeholder="Processzor, RAM, tartozékok, fizikai állapot..."
              value={leiras}
              onChange={(e) => setLeiras(e.target.value)}
              multiline
              rows={4}
              fullWidth
              className={styles.textField}
              helperText="Minden fontos technikai adatot ide írjon."
            />

            <Box sx={{ pt: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  className={styles.saveButton}
                  sx={{ py: 1.5 }}
                >
                  {loading ? "Mentés..." : "Eszköz rögzítése"}
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate("/eszkozok")}
                  startIcon={<CancelIcon />}
                  className={styles.cancelButton}
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
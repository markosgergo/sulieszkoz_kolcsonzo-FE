import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Chip,
  IconButton,
  Stack,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Alert
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";

export default function EszkozLista() {
  // --- ÁLLAPOTOK ---
  const [eszkozok, setEszkozok] = useState([]);
  const [szurtEszkozok, setSzurtEszkozok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Szűrési állapotok
  const [kereses, setKereses] = useState("");
  const [kategoria, setKategoria] = useState("Mind");

  // QR Dialog állapotok
  const [openQr, setOpenQr] = useState(false);
  const [selectedEszkoz, setSelectedEszkoz] = useState(null);

  const navigate = useNavigate();

  // --- ADATOK LEKÉRÉSE ---
  useEffect(() => {
    const fetchEszkozok = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllEszkoz();
        setEszkozok(data);
        setSzurtEszkozok(data);
      } catch (err) {
        setError("Nem sikerült betölteni az eszközöket.");
      } finally {
        setLoading(false);
      }
    };
    fetchEszkozok();
  }, []);

  // --- SZŰRÉSI LOGIKA ---
  // Ez fut le, ha változik a keresőmező, a kategória, vagy az alap lista
  useEffect(() => {
    const eredmeny = eszkozok.filter((eszkoz) => {
      const nevEgyezik = eszkoz.nev.toLowerCase().includes(kereses.toLowerCase());
      const kategoriaEgyezik = kategoria === "Mind" || eszkoz.tipus === kategoria;
      return nevEgyezik && kategoriaEgyezik;
    });
    setSzurtEszkozok(eredmeny);
  }, [kereses, kategoria, eszkozok]);

  // --- MŰVELETEK ---
  const handleOpenQr = (eszkoz) => {
    setSelectedEszkoz(eszkoz);
    setOpenQr(true);
  };

  const handleCloseQr = () => {
    setOpenQr(false);
    setSelectedEszkoz(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt az eszközt?")) {
      try {
        await ApiService.deleteEszkoz(id);
        setEszkozok(eszkozok.filter((e) => e.id !== id));
      } catch (err) {
        alert("Hiba történt a törlés során!");
      }
    }
  };

  // --- RENDERELÉS ---
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Eszköz lista
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* --- KERESŐ ÉS SZŰRŐ PANEL --- */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Keresés név alapján..."
            value={kereses}
            onChange={(e) => setKereses(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            sx={{ minWidth: { sm: 200 } }}
            label="Típus szűrés"
            value={kategoria}
            onChange={(e) => setKategoria(e.target.value)}
          >
            <MenuItem value="Mind">Összes típus</MenuItem>
            <MenuItem value="LAPTOP">Laptop</MenuItem>
            <MenuItem value="TABLET">Tablet</MenuItem>
            <MenuItem value="PROJEKTOR">Projektor</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* --- TÁBLÁZAT --- */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Név</b></TableCell>
              <TableCell><b>Típus</b></TableCell>
              <TableCell><b>Állapot</b></TableCell>
              <TableCell align="center"><b>Műveletek</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {szurtEszkozok.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">Nincs a keresésnek megfelelő eszköz.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              szurtEszkozok.map((eszkoz) => (
                <TableRow key={eszkoz.id} hover>
                  <TableCell>{eszkoz.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{eszkoz.nev}</TableCell>
                  <TableCell>{eszkoz.tipus}</TableCell>
                  <TableCell>
                    {eszkoz.allapot === "szabad" || eszkoz.elerheto === true ? (
                      <Chip label="Szabad" color="success" size="small" />
                    ) : (
                      <Chip label="Kölcsönözve" color="error" size="small" />
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        color="primary" 
                        title="Kölcsönzés"
                        onClick={() => navigate(`/kolcsonzes/${eszkoz.id}`)}
                      >
                        <AssignmentIcon />
                      </IconButton>

                      <IconButton 
                        color="secondary" 
                        title="QR Kód"
                        onClick={() => handleOpenQr(eszkoz)}
                      >
                        <QrCodeIcon/>
                      </IconButton>

                      <IconButton 
                        color="error" 
                        title="Törlés"
                        onClick={() => handleDelete(eszkoz.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- QR KÓD DIALOG --- */}
      <Dialog open={openQr} onClose={handleCloseQr}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {selectedEszkoz?.nev}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', minWidth: 280 }}>
          {selectedEszkoz && (
            <Box sx={{ p: 2 }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ESZKOZ_ID_${selectedEszkoz.id}`}
                alt="QR kód"
                style={{ width: '200px', height: '200px', marginBottom: '10px' }}
              />
              <Typography variant="body2" color="textSecondary">
                Azonosító: {selectedEszkoz.id}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Típus: {selectedEszkoz.tipus}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
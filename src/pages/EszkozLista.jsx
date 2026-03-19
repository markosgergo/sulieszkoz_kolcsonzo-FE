import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import { useAuth } from "../context/AuthContext";
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
  Alert,
  Button,
  Grid // JAVÍTVA: Importálva!
} from "@mui/material";

// Ikonok
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export default function EszkozLista() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eszkozok, setEszkozok] = useState([]);
  const [szurtEszkozok, setSzurtEszkozok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kereses, setKereses] = useState("");
  const [kategoria, setKategoria] = useState("Mind");

  const [openQr, setOpenQr] = useState(false);
  const [selectedEszkoz, setSelectedEszkoz] = useState(null);

  // Jogosultság ellenőrzése (Backend szerepkör alapján)
  const isAdmin = user?.szerepkorNev === "ADMIN" || user?.role === "ADMIN";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  // JAVÍTOTT SZŰRÉS: Kis- és nagybetű független (Case-insensitive)
  useEffect(() => {
    const eredmeny = eszkozok.filter((e) => {
      const nevMatch = e.nev.toLowerCase().includes(kereses.toLowerCase());
      
      // JAVÍTVA: Mindkét oldalt kisbetűre rakjuk az összehasonlításhoz
      const tipusMatch = kategoria === "Mind" || 
                         e.tipus.toLowerCase() === kategoria.toLowerCase();
      
      return nevMatch && tipusMatch;
    });
    setSzurtEszkozok(eredmeny);
  }, [kereses, kategoria, eszkozok]);

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt az eszközt?")) {
      try {
        await ApiService.deleteEszkoz(id);
        setEszkozok(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        alert("Hiba történt a törlés során!");
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isAdmin ? "Eszközök Kezelése" : "Eszközök"}
        </Typography>
        
        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate("/eszkozok/uj")}
          >
            Új eszköz
          </Button>
        )}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Kategória"
              value={kategoria}
              onChange={(e) => setKategoria(e.target.value)}
            >
              <MenuItem value="Mind">Összes kategória</MenuItem>
              <MenuItem value="laptop">Laptop</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
              <MenuItem value="telefon">Telefon</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: isAdmin ? 'primary.main' : 'grey.200' }}>
            <TableRow>
              <TableCell sx={{ color: isAdmin ? 'white' : 'black', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: isAdmin ? 'white' : 'black', fontWeight: 'bold' }}>Név</TableCell>
              <TableCell sx={{ color: isAdmin ? 'white' : 'black', fontWeight: 'bold' }}>Típus</TableCell>
              <TableCell sx={{ color: isAdmin ? 'white' : 'black', fontWeight: 'bold' }}>Állapot</TableCell>
              {isAdmin && <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Műveletek</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {szurtEszkozok.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Nincs találat.</TableCell>
              </TableRow>
            ) : (
              szurtEszkozok.map((eszkoz) => (
                <TableRow key={eszkoz.id} hover>
                  <TableCell>{eszkoz.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{eszkoz.nev}</TableCell>
                  <TableCell>{eszkoz.tipus}</TableCell>
                  <TableCell>
                    <Chip 
                      label={eszkoz.elerheto ? "Szabad" : "Kiadva"} 
                      color={eszkoz.elerheto ? "success" : "error"} 
                      size="small" 
                    />
                  </TableCell>
                  {isAdmin && (
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="info" onClick={() => navigate(`/kolcsonzes/${eszkoz.id}`)}>
                          <AssignmentIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => { setSelectedEszkoz(eszkoz); setOpenQr(true); }}>
                          <QrCodeIcon/>
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(eszkoz.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* JAVÍTOTT QR DIALOG: Cache-törléssel és hibakezeléssel */}
      <Dialog open={openQr} onClose={() => setOpenQr(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>{selectedEszkoz?.nev}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {selectedEszkoz && (
            <Box>
              <img
                src={`http://localhost:8080/api/eszkozok/${selectedEszkoz.id}/qrcode?t=${new Date().getTime()}`}
                alt="QR Kód"
                style={{ width: '250px', height: '250px', border: '1px solid #ddd', borderRadius: '8px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/250x250?text=QR+Hiba";
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>SKU: {selectedEszkoz.sku || "Nincs"}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
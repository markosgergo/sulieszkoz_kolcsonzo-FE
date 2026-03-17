import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService"; // Importáld az ApiService-t!
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
  CircularProgress // Töltés jelzéséhez
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function EszkozLista() {
  // 1. Az állapot most már üres lista alapból
  const [eszkozok, setEszkozok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [openQr, setOpenQr] = useState(false);
  const [selectedEszkoz, setSelectedEszkoz] = useState(null);

  // 2. Adatok lekérése a backendtől
useEffect(() => {
  const fetchEszkozok = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllEszkoz(); // Ezt a nevet használd!
      setEszkozok(data);
    } catch (err) {
      setError("Nem sikerült betölteni az eszközöket.");
    } finally {
      setLoading(false);
    }
  };
  fetchEszkozok();
}, []);

  const handleOpenQr = (eszkoz) => {
    setSelectedEszkoz(eszkoz);
    setOpenQr(true);
  };

  const handleCloseQr = () => {
    setOpenQr(false);
    setSelectedEszkoz(null);
  };

  // 3. Törlés élesítése (Backend hívással)
  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt az eszközt?")) {
      try {
        await ApiService.deleteEszkoz(id); // Ha van ilyen végpontod
        setEszkozok(eszkozok.filter((e) => e.id !== id));
      } catch (err) {
        alert("Hiba történt a törlés során!");
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 5 }}>{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Eszköz lista
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Név</TableCell>
              <TableCell>Típus</TableCell>
              <TableCell>Állapot</TableCell>
              <TableCell align="center">Műveletek</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {eszkozok.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Nincsenek elérhető eszközök.</TableCell>
              </TableRow>
            ) : (
              eszkozok.map((eszkoz) => (
                <TableRow key={eszkoz.id}>
                  <TableCell>{eszkoz.id}</TableCell>
                  <TableCell>{eszkoz.nev}</TableCell>
                  <TableCell>{eszkoz.tipus}</TableCell>
                  <TableCell>
                    {/* Itt figyelj: a backend valószínűleg elerheto (boolean) mezőt küld */}
                    {eszkoz.allapot === "szabad" || eszkoz.elerheto === true ? (
                      <Chip label="Szabad" color="success" />
                    ) : (
                      <Chip label="Kölcsönözve" color="error" />
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => navigate(`/kolcsonzes/${eszkoz.id}`)}
                      >
                        <AssignmentIcon />
                      </IconButton>

                      <IconButton color="secondary" onClick={() => handleOpenQr(eszkoz)}>
                        <QrCodeIcon/>
                      </IconButton>

                      <IconButton color="error" onClick={() => handleDelete(eszkoz.id)}>
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

      {/* QR KÓD DIALOG */}
      <Dialog open={openQr} onClose={handleCloseQr}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          {selectedEszkoz?.nev} - QR Kód
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, minWidth: 250 }}>
            {selectedEszkoz && (
              <>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ESZKOZ_ID_${selectedEszkoz.id}`}
                  alt="QR kód"
                  style={{ marginBottom: '15px' }}
                />
                <Typography variant="body2" color="textSecondary">
                  Azonosító: {selectedEszkoz.id}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Button, Chip, Box, CircularProgress, Alert, IconButton 
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function AdminKolcsonzesek() {
  const [kolcsonzesek, setKolcsonzesek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uzenet, setUzenet] = useState({ tipus: "success", szoveg: "" });

  const adatokBetoltese = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllKolcsonzes();
      setKolcsonzesek(data);
    } catch (err) {
      console.error("Hiba a kölcsönzések lekérésekor:", err);
      setUzenet({ tipus: "error", szoveg: "Nem sikerült betölteni a listát." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adatokBetoltese();
  }, []);

  const handleVisszavetel = async (id) => {
    try {
      await ApiService.visszavetel(id);
      setUzenet({ tipus: "success", szoveg: "Eszköz sikeresen visszavéve!" });
      // Frissítjük a listát a backendről a változás után
      await adatokBetoltese();
    } catch (err) {
      setUzenet({ tipus: "error", szoveg: "Hiba történt a visszavétel során." });
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Kölcsönzések adminisztrációja
        </Typography>
        <IconButton onClick={adatokBetoltese} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {uzenet.szoveg && (
        <Alert severity={uzenet.tipus} sx={{ mb: 3 }} onClose={() => setUzenet({ ...uzenet, szoveg: "" })}>
          {uzenet.szoveg}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Eszköz</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kölcsönző</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Határidő</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Státusz</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Művelet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.map((k) => {
              // LOGIKA: Ha a visszavetelDatuma NEM null, akkor már visszahozták.
              const isVisszahozva = k.visszavetelDatuma !== null;
              
              // Késés: Nincs visszahozva ÉS a határidő kisebb, mint a mai dátum
              const isExpired = !isVisszahozva && new Date(k.hatarido) < new Date();
              
              return (
                <TableRow 
                  key={k.id} 
                  sx={{ 
                    bgcolor: isVisszahozva ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                    transition: '0.2s'
                  }}
                >
                  <TableCell>{k.eszkozNev} ({k.eszkozSku})</TableCell>
                  <TableCell>{k.felhasznaloNev || "Ismeretlen diák"}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: isExpired ? 'error.main' : 'inherit', fontWeight: isExpired ? 'bold' : 'normal' }}>
                      {k.hatarido}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isVisszahozva ? (
                      <Chip label="Visszahozva" size="small" variant="outlined" />
                    ) : (
                      <Chip 
                        label={isExpired ? "Késésben" : "Nálad van"} 
                        color={isExpired ? "error" : "primary"} 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isVisszahozva ? (
                      <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Raktáron</Typography>
                      </Box>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleVisszavetel(k.id)}
                        size="small"
                      >
                        Visszavétel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
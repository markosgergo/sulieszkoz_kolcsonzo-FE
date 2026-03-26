import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Button, Chip, Box, 
  CircularProgress, Alert, IconButton, Tooltip 
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import QrScanner from "../components/QrScanner";

export default function AdminKolcsonzesek() {
  const [kolcsonzesek, setKolcsonzesek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uzenet, setUzenet] = useState({ tipus: "success", szoveg: "" });
  const [showScanner, setShowScanner] = useState(false);

  const adatokBetoltese = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllKolcsonzes();
      console.log("Backend adatok ellenőrzése:", data); // Itt látod majd a konzolban a mezőneveket!
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
    if (!window.confirm("Biztosan visszavételezettnek jelöli ezt az eszközt?")) return;
    try {
      await ApiService.visszavetel(id);
      setUzenet({ tipus: "success", szoveg: "Eszköz sikeresen visszavéve!" });
      await adatokBetoltese();
    } catch (err) {
      setUzenet({ tipus: "error", szoveg: "Hiba történt a visszavétel során." });
    }
  };

  const handleScanVisszavetel = async (decodedEszkozId) => {
    setShowScanner(false); // Bezárjuk a kamerát
    try {
      // Hívjuk a backendet a meglévő ApiService függvénnyel
      await ApiService.visszavetelByEszkozId(decodedEszkozId);
      setUzenet({ tipus: "success", szoveg: "Eszköz sikeresen visszavéve a QR kód alapján!" });
      await adatokBetoltese(); // Frissítjük a táblázatot
    } catch (err) {
      setUzenet({ tipus: "error", szoveg: "Hiba: " + (err.response?.data?.hiba || "Ezt az eszközt nem kell visszavenni.") });
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
        <Box>
          {/* ÚJ GOMB A QR VISSZAVÉTELHEZ */}
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<QrCodeScannerIcon />} 
            onClick={() => setShowScanner(true)}
            sx={{ mr: 2 }}
          >
            Gyors Visszavétel
          </Button>
          
          <IconButton onClick={adatokBetoltese} color="primary" sx={{ border: '1px solid #e0e0e0' }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      {uzenet.szoveg && (
        <Alert severity={uzenet.tipus} sx={{ mb: 3 }} onClose={() => setUzenet({ ...uzenet, szoveg: "" })}>
          {uzenet.szoveg}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Eszköz</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kölcsönző</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Határidő</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Státusz</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Művelet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.map((k) => {
              // MEGOLDÁS: Csak akkor visszahozott, ha a mező létezik ÉS van benne érték.
              // A Boolean() kezeli a null, undefined és üres string eseteket is.
              const isVisszahozva = Boolean(k.visszavetelDatuma || k.visszahozvaDatum);
              
              const hataridoDate = new Date(k.hatarido);
              const ma = new Date();
              ma.setHours(0, 0, 0, 0); 
              const isExpired = !isVisszahozva && hataridoDate < ma;

              return (
                <TableRow 
                  key={k.id} 
                  sx={{ 
                    bgcolor: isVisszahozva ? 'rgba(0, 0, 0, 0.03)' : 'inherit'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{k.eszkozNev}</Typography>
                    <Typography variant="caption" color="text.secondary">#{k.eszkozId}</Typography>
                  </TableCell>
                  <TableCell>{k.felhasznaloNev || "N/A"}</TableCell>
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
                        label={isExpired ? "Késésben" : "Kiadva"} 
                        color={isExpired ? "error" : "primary"} 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isVisszahozva ? (
                      <Box sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InventoryIcon sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">Raktáron</Typography>
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
      {/* ÚJ SZKENNER ABLAK */}
      <Dialog open={showScanner} onClose={() => setShowScanner(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Eszköz QR kódjának beolvasása</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
            Mutasd a kamerának az eszközre ragasztott QR kódot a visszavételhez!
          </Typography>
          {showScanner && <QrScanner onScanSuccess={handleScanVisszavetel} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
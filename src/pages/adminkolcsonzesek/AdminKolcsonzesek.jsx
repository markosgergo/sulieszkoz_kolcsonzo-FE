import { useState, useEffect } from "react";
import ApiService from "../../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Button, Chip, Box, 
  CircularProgress, Alert, IconButton, Tooltip, Stack 
} from "@mui/material";

import styles from "./AdminKolcsonzesek.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import QrScanner from "../../components/QrScanner";

export default function AdminKolcsonzesek() {
  const [kolcsonzesek, setKolcsonzesek] = useState([]);
  const [kiadasraVarok, setKiadasraVarok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uzenet, setUzenet] = useState({ tipus: "success", szoveg: "" });
  const [showScanner, setShowScanner] = useState(false);

  const adatokBetoltese = async () => {
    try {
      setLoading(true);
      const [osszes, varok] = await Promise.all([
        ApiService.getAllKolcsonzes(),
        ApiService.getKiadasraVaroKerelmek(),
      ]);
      setKolcsonzesek(osszes);
      setKiadasraVarok(varok);
    } catch (err) {
      console.error("Hiba:", err);
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

  const handleElfogad = async (id) => {
    try {
      await ApiService.elfogadKiadasKerelem(id);
      setUzenet({ tipus: "success", szoveg: "Eszköz kiadása jóváhagyva!" });
      await adatokBetoltese();
    } catch (err) {
      setUzenet({ tipus: "error", szoveg: "Hiba a jóváhagyás során." });
    }
  };

  const handleElutasit = async (id) => {
    if (!window.confirm("Biztosan elutasítod ezt a kérelmet?")) return;
    try {
      await ApiService.elutasitKiadasKerelem(id);
      setUzenet({ tipus: "success", szoveg: "Kérelem elutasítva." });
      await adatokBetoltese();
    } catch (err) {
      setUzenet({ tipus: "error", szoveg: "Hiba az elutasítás során." });
    }
  };

  const parseQrEszkozId = (qrString) => {
    const match = qrString.match(/ESZKOZ_ID[:\s]*(\d+)/i);
    if (match) return match[1];
    const numOnly = qrString.trim();
    if (/^\d+$/.test(numOnly)) return numOnly;
    return null;
  };

  const handleQrScanSuccess = async (decodedText) => {
    try {
      // 1. Kiszedjük a számot az "ESZKOZ_ID:5 | SKU..." szövegből
      const match = decodedText.match(/ESZKOZ_ID:(\d+)/);
      
      if (match && match[1]) {
        const tisztaEszkozId = parseInt(match[1], 10);
        
        // 2. Elküldjük a tiszta ID-t a backendnek
        await ApiService.visszavetelByEszkozId(tisztaEszkozId);
        
        alert(`Sikeres visszavétel! (Eszköz ID: ${tisztaEszkozId})`);
        
        // 3. Opcionális: Frissítsd a listát a képernyőn
        // loadKolcsonzesek(); 
      } else {
        alert("Érvénytelen QR kód! Ezt nem a mi rendszerünk generálta.");
      }
    } catch (error) {
      alert("Hiba a visszavétel során: " + (error.response?.data?.hiba || error.message));
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" className={styles.container} sx={{ mt: { xs: 2, md: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Kölcsönzések kezelése
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aktív folyamatok és visszavételezés
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            color="secondary" 
            className={styles.actionButton}
            startIcon={<QrCodeScannerIcon />} 
            onClick={() => setShowScanner(true)}
          >
            Gyors Visszavétel
          </Button>
          <Tooltip title="Frissítés">
            <IconButton onClick={adatokBetoltese} sx={{ border: '1px solid #e2e8f0' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {uzenet.szoveg && (
        <Alert severity={uzenet.tipus} sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setUzenet({ ...uzenet, szoveg: "" })}>
          {uzenet.szoveg}
        </Alert>
      )}

      {/* ── KIADÁSRA VÁRÓ KÉRELMEK SZEKCIÓ ── */}
      {kiadasraVarok.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Chip label={kiadasraVarok.length} color="warning" size="small" sx={{ fontWeight: 700 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#b45309' }}>
              Jóváhagyásra váró kérelmek
            </Typography>
          </Stack>
          <TableContainer component={Paper} sx={{ border: '2px solid #fde68a', borderRadius: '12px', overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#fffbeb' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Eszköz</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Kérelmező diák</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Kért határidő</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Döntés</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kiadasraVarok.map((k) => (
                  <TableRow key={k.id} sx={{ bgcolor: '#fffef0' }}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{k.eszkozNev}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>#{k.eszkozId}</Typography>
                    </TableCell>
                    <TableCell>{k.felhasznaloNev || "N/A"}</TableCell>
                    <TableCell>{k.hatarido}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleElfogad(k.id)}
                          className={styles.actionButton}
                        >
                          Kiadás jóváhagyása
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleElutasit(k.id)}
                        >
                          Elutasítás
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ── ÖSSZES KÖLCSÖNZÉS TÁBLÁZAT ── */}
      <TableContainer component={Paper} className={styles.tableContainer} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.headerCell}>Eszköz / ID</TableCell>
              <TableCell className={styles.headerCell}>Kölcsönző</TableCell>
              <TableCell className={styles.headerCell}>Határidő</TableCell>
              <TableCell className={styles.headerCell}>Státusz</TableCell>
              <TableCell align="center" className={styles.headerCell}>Művelet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.map((k) => {
              const isKiadasraVar = k.statuszNev === "KIADASRA_VAR";
              const isVisszahozva = !!(k.visszavetelDatuma || k.visszahozvaDatum);
              const isExpired = !isVisszahozva && !isKiadasraVar && new Date(k.hatarido) < new Date().setHours(0,0,0,0);

              return (
                <TableRow 
                  key={k.id} 
                  className={`${styles.tableRow} ${isVisszahozva ? styles.returnedRow : ""}`}
                  sx={isKiadasraVar ? { bgcolor: '#fffef0' } : {}}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{k.eszkozNev}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: '#f1f5f9', px: 0.5, borderRadius: 1 }}>
                        #{k.eszkozId}
                    </Typography>
                  </TableCell>
                  <TableCell>{k.felhasznaloNev || "N/A"}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: isExpired ? 'error.main' : 'inherit', fontWeight: isExpired ? 700 : 400 }}>
                      {k.hatarido}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        isKiadasraVar ? "Kiadásra vár" :
                        isVisszahozva ? "Visszahozva" :
                        isExpired ? "Késésben" : "Kiadva"
                      } 
                      color={
                        isKiadasraVar ? "warning" :
                        isVisszahozva ? "default" :
                        isExpired ? "error" : "primary"
                      } 
                      size="small" 
                      variant={isVisszahozva ? "outlined" : "filled"}
                      sx={{ fontWeight: 600, borderRadius: '6px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {isKiadasraVar ? (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Jóváhagyásra vár
                      </Typography>
                    ) : isVisszahozva ? (
                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ color: 'text.disabled' }}>
                        <InventoryIcon fontSize="small" />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Raktáron</Typography>
                      </Stack>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="success" 
                        className={styles.actionButton}
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

      <Dialog 
        open={showScanner} 
        onClose={() => setShowScanner(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ className: styles.scannerDialog }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>QR Visszavétel</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Olvasd be az eszköz kódját a gyors visszavételhez!
          </Typography>
          <Box className={styles.scannerFrame}>
            {showScanner && <QrScanner onScanSuccess={handleQrScanSuccess} />}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
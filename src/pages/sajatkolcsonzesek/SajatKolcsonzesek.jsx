import { useState, useEffect } from "react";
import ApiService from "../../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Chip, Box, CircularProgress, Alert,
  Stack, Divider
} from "@mui/material";

export default function SajatKolcsonzesek() {
  const [kolcsonzesek, setKolcsonzesek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

  useEffect(() => {
    fetchSajatAdatok();
  }, []);

  const fetchSajatAdatok = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getSajatKolcsonzesek();
      // Sorrend: az aktívak (amiknél nincs visszavétel dátum) kerüljenek előre
      const rendezettData = data.sort((a, b) => {
        if (a.visszavetelDatuma === null && b.visszavetelDatuma !== null) return -1;
        if (a.visszavetelDatuma !== null && b.visszavetelDatuma === null) return 1;
        return new Date(b.kiadasDatuma) - new Date(a.kiadasDatuma);
      });
      setKolcsonzesek(rendezettData);
    } catch (err) {
      console.error("Hiba a saját kölcsönzések lekérésekor:", err);
      setHiba("Nem sikerült betölteni a kölcsönzéseidet.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Saját kölcsönzéseim
        </Typography>
        <Chip label={`${kolcsonzesek.length} tétel`} variant="outlined" color="primary" />
      </Stack>

      {hiba && <Alert severity="error" sx={{ mb: 2 }}>{hiba}</Alert>}

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell><b>Eszköz adatai</b></TableCell>
              <TableCell><b>Kivétel / Határidő</b></TableCell>
              <TableCell align="center"><b>Állapot</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">Jelenleg nincs aktív vagy múltbéli kölcsönzésed.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              kolcsonzesek.map((k) => {
                const isVisszahozva = k.visszavetelDatuma !== null;
                
                // Késés precíz számítása
                const hataridoDate = new Date(k.hatarido);
                const ma = new Date();
                ma.setHours(0, 0, 0, 0); // Idő nullázása, hogy csak a napot nézzük
                const isKesesben = !isVisszahozva && hataridoDate < ma;

                return (
                  <TableRow 
                    key={k.id} 
                    sx={{ 
                      bgcolor: isVisszahozva ? 'action.hover' : 'inherit',
                      '&:hover': { bgcolor: 'action.selected' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: isVisszahozva ? 'normal' : 'bold' }}>
                        {k.eszkozNev}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Azonosító: #{k.eszkozId}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        Kiásva: {k.kiadasDatuma ? new Date(k.kiadasDatuma).toLocaleDateString('hu-HU') : "-"}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: isKesesben ? 'bold' : 'normal',
                          color: isKesesben ? 'error.main' : 'text.secondary'
                        }}
                      >
                        Határidő: {k.hatarido}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      {isVisszahozva ? (
                        <Chip 
                          label="Visszahozva" 
                          color="success" 
                          variant="outlined" 
                          size="small" 
                          sx={{ opacity: 0.6 }}
                        />
                      ) : (
                        <Chip 
                          label={isKesesben ? "Késésben!" : "Nálad van"} 
                          color={isKesesben ? "error" : "primary"} 
                          sx={{ fontWeight: 'bold' }}
                          size="medium"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && kolcsonzesek.length > 0 && (
        <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'right', color: 'text.secondary' }}>
          Az adatok automatikusan frissülnek a központi adatbázis alapján.
        </Typography>
      )}
    </Container>
  );
}
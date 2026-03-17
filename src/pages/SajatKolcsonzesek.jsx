import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Chip, Box, CircularProgress, Alert 
} from "@mui/material";

export default function SajatKolcsonzesek() {
  const [kolcsonzesek, setKolcsonzesek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiba, setHiba] = useState("");

  useEffect(() => {
    const fetchSajatAdatok = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getSajatKolcsonzesek();
        setKolcsonzesek(data);
      } catch (err) {
        console.error("Hiba a saját kölcsönzések lekérésekor:", err);
        setHiba("Nem sikerült betölteni a kölcsönzéseidet.");
      } finally {
        setLoading(false);
      }
    };

    fetchSajatAdatok();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Saját kölcsönzéseim
      </Typography>

      {hiba && <Alert severity="error" sx={{ mb: 2 }}>{hiba}</Alert>}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Eszköz</b></TableCell>
              <TableCell><b>Kivétel dátuma</b></TableCell>
              <TableCell><b>Határidő</b></TableCell>
              <TableCell align="center"><b>Státusz</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  Jelenleg nincs aktív vagy múltbéli kölcsönzésed.
                </TableCell>
              </TableRow>
            ) : (
              kolcsonzesek.map((k) => {
                // FONTOS: A Java DTO-dban visszavetelDatuma van!
                const isVisszahozva = k.visszavetelDatuma !== null;
                
                // Késés: nincs visszahozva és a határidő már elmúlt
                const isKesesben = !isVisszahozva && new Date(k.hatarido) < new Date();

                return (
                  <TableRow 
                    key={k.id} 
                    sx={{ 
                      bgcolor: isVisszahozva ? 'rgba(0, 0, 0, 0.02)' : 'inherit',
                      opacity: isVisszahozva ? 0.7 : 1 
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>{k.eszkozNev}</TableCell>
                    <TableCell>
                      {k.kiadasDatuma ? new Date(k.kiadasDatuma).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        fontWeight: 'bold', 
                        color: isKesesben ? 'error.main' : 'inherit' 
                      }}>
                        {k.hatarido}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {isVisszahozva ? (
                        <Chip 
                          label="Visszavíve" 
                          color="default" 
                          variant="outlined" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          label={isKesesben ? "Késésben" : "Nálad van"} 
                          color={isKesesben ? "error" : "primary"} 
                          size="small"
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
    </Container>
  );
}
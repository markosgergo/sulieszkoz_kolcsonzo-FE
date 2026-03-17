import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Chip, Box, CircularProgress 
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
        setHiba("Nem sikerült betölteni a listát.");
      } finally {
        setLoading(false);
      }
    };

    fetchSajatAdatok();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Saját kölcsönzéseim
      </Typography>

      {hiba && <Typography color="error">{hiba}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#eeeeee' }}>
            <TableRow>
              <TableCell><b>Eszköz</b></TableCell>
              <TableCell><b>Kivétel dátuma</b></TableCell>
              <TableCell><b>Határidő</b></TableCell>
              <TableCell><b>Státusz</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Jelenleg nincs aktív kölcsönzésed.</TableCell>
              </TableRow>
            ) : (
              kolcsonzesek.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>{k.eszkozNev}</TableCell>
                  <TableCell>{k.datum}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 'bold', color: new Date(k.hatarido) < new Date() ? 'error.main' : 'inherit' }}>
                      {k.hatarido}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {k.visszahozva ? (
                      <Chip label="Visszahozva" color="default" variant="outlined" />
                    ) : (
                      <Chip 
                        label={new Date(k.hatarido) < new Date() ? "Késésben" : "Nálad van"} 
                        color={new Date(k.hatarido) < new Date() ? "error" : "primary"} 
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
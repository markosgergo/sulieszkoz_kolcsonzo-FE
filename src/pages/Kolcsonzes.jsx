import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, Paper, Typography, TextField, Button, Stack, Alert, Box 
} from "@mui/material";

export default function Kolcsonzes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [eszkoz, setEszkoz] = useState(null);
  const [napok, setNapok] = useState(1);
  const [success, setSuccess] = useState(false);

  // Szimulált adatlekérés az ID alapján
  useEffect(() => {
    const mockEszkozok = [
      { id: 1, nev: "Laptop Dell", tipus: "Laptop" },
      { id: 2, nev: "Projektor Epson", tipus: "Projektor" },
      { id: 3, nev: "Egér Logitech", tipus: "Kiegészítő" }
    ];
    
    const talalat = mockEszkozok.find(e => e.id === parseInt(id));
    setEszkoz(talalat);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Itt küldenéd az API-nak: { eszkoz_id: id, napok: napok }
    setSuccess(true);
    
    // 2 másodperc múlva visszaviszünk a listához
    setTimeout(() => {
      navigate("/eszkozok");
    }, 2000);
  };

  if (!eszkoz) return <Typography>Betöltés...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kölcsönzés rögzítése
        </Typography>
        
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1"><b>Eszköz:</b> {eszkoz.nev}</Typography>
          <Typography variant="subtitle1"><b>Típus:</b> {eszkoz.tipus}</Typography>
          <Typography variant="subtitle1"><b>Azonosító:</b> #{id}</Typography>
        </Box>

        {success ? (
          <Alert severity="success">
            Sikeres kölcsönzés! Visszairányítás a listához...
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Hány napra veszed ki?"
                type="number"
                value={napok}
                onChange={(e) => setNapok(e.target.value)}
                inputProps={{ min: 1, max: 14 }}
                fullWidth
                required
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                fullWidth
              >
                Kölcsönzés indítása
              </Button>
              
              <Button 
                variant="text" 
                onClick={() => navigate("/eszkozok")}
              >
                Mégse
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
}
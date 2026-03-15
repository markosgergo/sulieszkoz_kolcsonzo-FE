import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack
} from "@mui/material";

export default function UjEszkoz() {

  const [nev, setNev] = useState("");
  const [tipus, setTipus] = useState("");
  const [sku, setSku] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const ujEszkoz = {
      nev,
      tipus,
      sku
    };

    console.log("Új eszköz:", ujEszkoz);

    alert("Eszköz hozzáadva (mock)");

    setNev("");
    setTipus("");
    setSku("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>

        <Typography variant="h4" sx={{ mb: 3 }}>
          Új eszköz hozzáadása
        </Typography>

        <form onSubmit={handleSubmit}>

          <Stack spacing={2}>

            <TextField
              label="Eszköz neve"
              value={nev}
              onChange={(e) => setNev(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Típus"
              value={tipus}
              onChange={(e) => setTipus(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
            >
              Mentés
            </Button>

          </Stack>

        </form>

      </Paper>
    </Container>
  );
}
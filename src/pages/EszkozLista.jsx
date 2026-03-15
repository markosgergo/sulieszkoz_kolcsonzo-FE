import { useEffect, useState } from "react";
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
  Stack
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
  const [eszkozok, setEszkozok] = useState([
    { id: 1, nev: "Laptop Dell", tipus: "Laptop", allapot: "szabad" },
    { id: 2, nev: "Projektor Epson", tipus: "Projektor", allapot: "kolcsonozve" },
    { id: 3, nev: "Egér Logitech", tipus: "Kiegészítő", allapot: "szabad" }
  ]);

  // QR Modal állapota
  const [openQr, setOpenQr] = useState(false);
  const [selectedEszkoz, setSelectedEszkoz] = useState(null);

  const handleOpenQr = (eszkoz) => {
    setSelectedEszkoz(eszkoz);
    setOpenQr(true);
  };

  const handleCloseQr = () => {
    setOpenQr(false);
    setSelectedEszkoz(null);
  };

  const handleDelete = (id) => {
    setEszkozok(eszkozok.filter((e) => e.id !== id));
  };

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
            {eszkozok.map((eszkoz) => (
              <TableRow key={eszkoz.id}>
                <TableCell>{eszkoz.id}</TableCell>
                <TableCell>{eszkoz.nev}</TableCell>
                <TableCell>{eszkoz.tipus}</TableCell>
                <TableCell>
                   {eszkoz.allapot === "szabad" ? (
                    <Chip label="Szabad" color="success" />
                  ) : (
                    <Chip label="Kölcsönözve" color="error" />
                  )}
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary">
                      <AssignmentIcon />
                    </IconButton>

                    {/* QR gomb kattintás kezelése */}
                    <IconButton color="secondary" onClick={() => handleOpenQr(eszkoz)}>
                      <QrCodeIcon/>
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(eszkoz.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* QR KÓD DIALOG (FELUGRÓ ABLAK) */}
      <Dialog open={openQr} onClose={handleCloseQr}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          {selectedEszkoz?.nev} - QR Kód
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              minWidth: 250
            }}
          >
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
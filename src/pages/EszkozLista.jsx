import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import { useAuth } from "../context/AuthContext";
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, Chip, IconButton, Stack, CircularProgress,
  TextField, MenuItem, InputAdornment, Dialog, DialogTitle, DialogContent,
  Box, Button, Grid, Collapse
} from "@mui/material";

// Ikonok
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AssignmentIcon from "@mui/icons-material/Assignment"; 
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; 
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

function Row({ eszkoz, isAdmin, user, navigate, handleDelete, handleOpenQr, onRefresh }) {
  const [open, setOpen] = useState(false);


  const handlePrintQr = async (eszkozId) => {
    try {
        // A te meglévő függvényed legenerálja a kép URL-jét
        const imageUrl = await ApiService.getEszkozQrCode(eszkozId); 
        
        // Új ablak nyitása és azonnali nyomtatás
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>QR Kód Nyomtatása</title></head>
                <body style="text-align: center; margin-top: 50px;">
                    <img src="${imageUrl}" style="width: 200px; height: 200px;" onload="window.print(); window.close();" />
                </body>
            </html>
        `);
    } catch (error) {
        console.error("Hiba a QR kód lekérésekor", error);
    }
  };
  // ADMIN: Visszavétel funkció
  const handleVisszavetel = async () => {
    if (window.confirm(`Biztosan visszaveszed a(z) ${eszkoz.nev} eszközt?`)) {
      try {
        // 1. Lekérjük az összes kölcsönzést, hogy megtaláljuk, melyik az aktív ehhez az eszközhöz
        const osszesKolcsonzes = await ApiService.getAllKolcsonzes();
        
        // 2. Megkeressük azt a kölcsönzést, ami ehhez az eszközhöz tartozik és még nincs visszahozva
        const aktivKolcsonzes = osszesKolcsonzes.find(k => 
          k.eszkozId === eszkoz.id && 
          !(k.visszavetelDatuma || k.visszahozvaDatum)
        );

        if (aktivKolcsonzes) {
          // 3. Ha megvan a kölcsönzés ID-ja, meghívjuk a már működő visszavételt
          await ApiService.visszavetel(aktivKolcsonzes.id);
          alert("Eszköz sikeresen visszavéve!");
          onRefresh(); // Lista frissítése
        } else {
          alert("Nem található aktív kölcsönzés ehhez az eszközhöz a rendszerben.");
        }
      } catch (err) {
        console.error("Visszavételi hiba:", err);
        alert("Hiba a visszavétel során! Részletek a konzolban.");
      }
    }
  };

  // USER: Foglalás funkció (Backend módosítás nélkül, a meglévő createKolcsonzes-t használva)
  const handleFoglalas = async () => {
    if (window.confirm(`Szeretnéd lefoglalni a következőt: ${eszkoz.nev}?`)) {
      try {
        const foglalasAdat = {
          felhasznaloId: user.id, 
          eszkozId: eszkoz.id,
          kiadoId: 1, // FONTOS: Itt egy létező Admin ID-t adj meg (pl. 1)
          hatarido: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +7 nap
        };

        await ApiService.createKolcsonzes(foglalasAdat);
        alert("Sikeres foglalás!");
        onRefresh();
      } catch (err) {
        alert("Hiba a foglalásnál! (Ellenőrizd, hogy létezik-e az 1-es ID-jú admin)");
      }
    }
  };

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{eszkoz.id}</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>{eszkoz.nev}</TableCell>
        <TableCell>{eszkoz.tipus}</TableCell>
        <TableCell>
          <Chip 
            label={eszkoz.elerheto ? "Szabad" : "Kiadva / Foglalt"} 
            color={eszkoz.elerheto ? "success" : "error"} 
            size="small" 
          />
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            
            {/* ADMIN Funkciók */}
            {isAdmin && (
              <>
                {eszkoz.elerheto ? (
                  <IconButton color="info" onClick={() => navigate(`/kolcsonzes/${eszkoz.id}`)} title="Kiadás">
                    <AssignmentIcon />
                  </IconButton>
                ) : (
                  <IconButton color="success" onClick={handleVisszavetel} title="Visszavétel">
                    <AssignmentTurnedInIcon />
                  </IconButton>
                )}
              </>
            )}

            {/* USER Funkció (Lefoglalás) - Csak ha szabad az eszköz és nem admin a user */}
            {!isAdmin && eszkoz.elerheto && (
              <Button 
                variant="contained" 
                size="small" 
                color="secondary" 
                startIcon={<BookmarkAddIcon />}
                onClick={handleFoglalas}
              >
                Lefoglalás
              </Button>
            )}

            {/* Közös gombok (pl. QR kód) */}
            <IconButton color="secondary" onClick={() => handleOpenQr(eszkoz)} title="QR Kód">
              <QrCodeIcon/>
            </IconButton>

            {isAdmin && (
              <IconButton color="error" onClick={() => handleDelete(eszkoz.id)} title="Törlés">
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee' }}>
              <Typography variant="h6" gutterBottom color="primary">Részletek</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2"><b>Leírás:</b> {eszkoz.leiras || "Nincs leírás."}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2"><b>SKU:</b> {eszkoz.sku || "Nincs SKU"}</Typography>
                  <Typography variant="body2"><b>Státusz:</b> {eszkoz.elerheto ? "Kölcsönözhető" : "Foglalt/Kiadva"}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function EszkozLista() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eszkozok, setEszkozok] = useState([]);
  const [szurtEszkozok, setSzurtEszkozok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kereses, setKereses] = useState("");
  const [kategoria, setKategoria] = useState("Mind");

  const [openQr, setOpenQr] = useState(false);
  const [selectedEszkoz, setSelectedEszkoz] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  const isAdmin = user?.szerepkorNev === "ADMIN" || user?.role === "ADMIN";

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllEszkoz();
      setEszkozok(data);
      setSzurtEszkozok(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleOpenQr = async (eszkoz) => {
    setSelectedEszkoz(eszkoz);
    setOpenQr(true);
    setQrLoading(true);
    try {
      const url = await ApiService.getEszkozQrCode(eszkoz.id);
      setQrImageUrl(url);
    } catch (err) { console.error(err); }
    finally { setQrLoading(false); }
  };

  const handleCloseQr = () => {
    if (qrImageUrl) URL.revokeObjectURL(qrImageUrl);
    setQrImageUrl(null);
    setOpenQr(false);
  };

  useEffect(() => {
    const eredmeny = eszkozok.filter((e) => {
      const nevMatch = e.nev.toLowerCase().includes(kereses.toLowerCase());
      const tipusMatch = kategoria === "Mind" || e.tipus.toLowerCase() === kategoria.toLowerCase();
      return nevMatch && tipusMatch;
    });
    setSzurtEszkozok(eredmeny);
  }, [kereses, kategoria, eszkozok]);

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törlöd az eszközt?")) {
      try {
        await ApiService.deleteEszkoz(id);
        fetchData();
      } catch (err) { alert("Hiba a törlésnél!"); }
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Eszközök Kezelése</Typography>
        {isAdmin && <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/eszkozok/uj")}>Új eszköz</Button>}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth placeholder="Keresés név alapján..." value={kereses} onChange={(e) => setKereses(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select fullWidth label="Kategória" value={kategoria} onChange={(e) => setKategoria(e.target.value)}>
              <MenuItem value="Mind">Összes</MenuItem>
              <MenuItem value="laptop">Laptop</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell /><TableCell sx={{color: 'white'}}>ID</TableCell>
              <TableCell sx={{color: 'white'}}>Név</TableCell>
              <TableCell sx={{color: 'white'}}>Típus</TableCell>
              <TableCell sx={{color: 'white'}}>Állapot</TableCell>
              <TableCell align="center" sx={{color: 'white'}}>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {szurtEszkozok.map((eszkoz) => (
              <Row 
                key={eszkoz.id} 
                eszkoz={eszkoz} 
                isAdmin={isAdmin} 
                user={user} 
                navigate={navigate} 
                handleDelete={handleDelete} 
                handleOpenQr={handleOpenQr} 
                onRefresh={fetchData} 
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openQr} onClose={handleCloseQr}>
        <DialogTitle sx={{ textAlign: 'center' }}>{selectedEszkoz?.nev}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {qrLoading ? <CircularProgress /> : (
            <Box>
              <img src={qrImageUrl} alt="QR" style={{ width: '250px', height: '250px', border: '1px solid #ddd', borderRadius: '8px' }} />
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>SKU: {selectedEszkoz?.sku}</Typography>
              
              {/* ÚJ NYOMTATÁS GOMB */}
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                      <html>
                          <head><title>${selectedEszkoz?.nev} - QR Kód</title></head>
                          <body style="text-align: center; margin-top: 50px;">
                              <h2>${selectedEszkoz?.nev}</h2>
                              <img src="${qrImageUrl}" style="width: 250px; height: 250px;" onload="window.print(); window.close();" />
                              <p>SKU: ${selectedEszkoz?.sku}</p>
                          </body>
                      </html>
                  `);
                }}
              >
                QR Kód Nyomtatása
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
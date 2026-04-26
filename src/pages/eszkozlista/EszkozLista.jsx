import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useAuth } from "../../context/AuthContext";
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, Chip, IconButton, Stack, CircularProgress,
  TextField, MenuItem, InputAdornment, Dialog, DialogTitle, DialogContent,
  Box, Button, Grid, Collapse
} from "@mui/material";
import styles from "./EszkozLista.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AssignmentIcon from "@mui/icons-material/Assignment"; 
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; 
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

function Row({ eszkoz, isAdmin, isStaff, user, navigate, handleDelete, handleOpenQr, onRefresh }) {
  const [open, setOpen] = useState(false);

  const handleVisszavetel = async () => {
    if (window.confirm(`Biztosan visszaveszed a(z) ${eszkoz.nev} eszközt?`)) {
      try {
        const osszesKolcsonzes = await ApiService.getAllKolcsonzes();
        const aktivKolcsonzes = osszesKolcsonzes.find(k => 
          k.eszkozId === eszkoz.id && !(k.visszavetelDatuma || k.visszahozvaDatum)
        );

        if (aktivKolcsonzes) {
          await ApiService.visszavetel(aktivKolcsonzes.id);
          alert("Eszköz sikeresen visszavéve!");
          onRefresh();
        } else {
          alert("Nem található aktív kölcsönzés.");
        }
      } catch (err) {
        console.error(err);
        alert("Hiba a visszavétel során!");
      }
    }
  };

  const handleFoglalas = async () => {
    if (window.confirm(`Szeretnéd lefoglalni a következőt: ${eszkoz.nev}?`)) {
      try {
        const foglalasAdat = {
          felhasznaloId: user.id,
          eszkozId: eszkoz.id,
          // kiadoId szándékosan nincs megadva – a backend KIADASRA_VAR státuszt ad
          hatarido: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        await ApiService.createKolcsonzes(foglalasAdat);
        alert("Foglalási kérelem elküldve! Az alkalmazott vagy admin jóváhagyásra vár.");
        onRefresh();
      } catch (err) {
        alert("Hiba a foglalásnál!");
      }
    }
  };

  return (
    <>
      <TableRow className={styles.tableRow} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{eszkoz.id}</TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: '#1e293b' }}>{eszkoz.nev}</TableCell>
        <TableCell>{eszkoz.tipus}</TableCell>
        <TableCell>
          <Chip 
            label={eszkoz.elerheto ? "Szabad" : eszkoz.kiadasraVar ? "Kiadásra vár" : "Kiadva"} 
            color={eszkoz.elerheto ? "success" : eszkoz.kiadasraVar ? "warning" : "error"} 
            size="small" 
            sx={{ fontWeight: 600, borderRadius: '6px' }}
          />
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            {isStaff && (
              <>
                {eszkoz.elerheto ? (
                  <IconButton color="info" onClick={() => navigate(`/kolcsonzes/${eszkoz.id}`)} title="Kiadás">
                    <AssignmentIcon />
                  </IconButton>
                ) : eszkoz.kiadasraVar ? (
                  // Kiadásra vár – nem lehet visszavenni, csak jóváhagyni az admin oldalon
                  <IconButton disabled title="Jóváhagyásra vár" sx={{ opacity: 0.35 }}>
                    <AssignmentTurnedInIcon />
                  </IconButton>
                ) : (
                  <IconButton color="success" onClick={handleVisszavetel} title="Visszavétel">
                    <AssignmentTurnedInIcon />
                  </IconButton>
                )}
              </>
            )}

            {!isStaff && eszkoz.elerheto && (
              <Button 
                variant="contained" 
                size="small" 
                color="secondary" 
                className={styles.actionButton}
                startIcon={<BookmarkAddIcon />}
                onClick={handleFoglalas}
              >
                Lefoglalás
              </Button>
            )}

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
            <Box className={styles.detailsBox} sx={{ margin: 2, p: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, color: '#334155' }}>
                Eszköz részletei
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary"><b>Leírás:</b></Typography>
                  <Typography variant="body1">{eszkoz.leiras || "Nincs megadva leírás."}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary"><b>Azonosítók:</b></Typography>
                  <Typography variant="body1">SKU: {eszkoz.sku || "Nincs"}</Typography>
                  <Typography variant="body1">ID: {eszkoz.id}</Typography>
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
  const isStaff = isAdmin || user?.szerepkorNev === "ALKALMAZOTT";

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const isStaffUser = user?.szerepkorNev === "ADMIN" || user?.role === "ADMIN" || user?.szerepkorNev === "ALKALMAZOTT";
      const [eszkozData, kolcsonzesData] = await Promise.all([
        ApiService.getAllEszkoz(),
        isStaffUser
          ? ApiService.getKiadasraVaroKerelmek().catch(() => [])
          : ApiService.getSajatKolcsonzesek().catch(() => []),
      ]);
      // Minden eszközhöz megkeressük, van-e KIADASRA_VAR státuszú kölcsönzés
      const kiadasraVarEszkozIds = new Set(
        kolcsonzesData
          .filter(k => k.statuszNev === "KIADASRA_VAR")
          .map(k => k.eszkozId)
      );
      const enrichedData = eszkozData.map(e => ({
        ...e,
        kiadasraVar: kiadasraVarEszkozIds.has(e.id),
      }));
      setEszkozok(enrichedData);
      setSzurtEszkozok(enrichedData);
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
    <Container maxWidth="lg" className={styles.container} sx={{ mt: { xs: 2, md: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={2} sx={{ mb: 3 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>Eszközök</Typography>
            <Typography variant="body2" color="text.secondary">Leltár és kölcsönzések kezelése</Typography>
        </Box>
        {isAdmin && (
            <Button 
                variant="contained" 
                className={styles.actionButton}
                startIcon={<AddIcon />} 
                onClick={() => navigate("/eszkozok/uj")}
                sx={{ borderRadius: '10px', px: 3 }}
            >
                Új eszköz
            </Button>
        )}
      </Stack>

      <Paper className={styles.filterPaper} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField 
                fullWidth 
                placeholder="Keresés név vagy típus alapján..." 
                value={kereses} 
                onChange={(e) => setKereses(e.target.value)}
                variant="outlined"
                InputProps={{ 
                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                    sx: { borderRadius: '10px' }
                }} 
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField 
                select 
                fullWidth 
                label="Kategória" 
                value={kategoria} 
                onChange={(e) => setKategoria(e.target.value)}
                InputProps={{ sx: { borderRadius: '10px' } }}
            >
              <MenuItem value="Mind">Összes kategória</MenuItem>
              <MenuItem value="laptop">Laptopok</MenuItem>
              <MenuItem value="tablet">Tabletek</MenuItem>
              <MenuItem value="projektor">Projektorok</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} className={styles.tableContainer} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell />
              <TableCell className={styles.tableHeaderCell}>ID</TableCell>
              <TableCell className={styles.tableHeaderCell}>Eszköz neve</TableCell>
              <TableCell className={styles.tableHeaderCell}>Típus</TableCell>
              <TableCell className={styles.tableHeaderCell}>Állapot</TableCell>
              <TableCell align="center" className={styles.tableHeaderCell}>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {szurtEszkozok.map((eszkoz) => (
              <Row 
                key={eszkoz.id} 
                eszkoz={eszkoz} 
                isAdmin={isAdmin}
                isStaff={isStaff}
                user={user} 
                navigate={navigate} 
                handleDelete={handleDelete} 
                handleOpenQr={handleOpenQr} 
                onRefresh={fetchData} 
              />
            ))}
          </TableBody>
        </Table>
        {szurtEszkozok.length === 0 && (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography color="text.secondary">Nincs a keresésnek megfelelő eszköz.</Typography>
            </Box>
        )}
      </TableContainer>

      <Dialog 
        open={openQr} 
        onClose={handleCloseQr}
        PaperProps={{ className: styles.qrDialog }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{selectedEszkoz?.nev}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {qrLoading ? <CircularProgress /> : (
            <Box>
              <img 
                src={qrImageUrl} 
                alt="QR" 
                className={styles.qrImage}
                style={{ width: '220px', height: '220px', border: '1px solid #f1f5f9', padding: '10px', borderRadius: '12px' }} 
              />
              <Typography variant="h6" sx={{ mt: 2, color: '#64748b' }}>SKU: {selectedEszkoz?.sku}</Typography>
              
              <Button 
                variant="outlined" 
                fullWidth
                className={styles.actionButton}
                color="primary" 
                sx={{ mt: 3 }}
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                      <html>
                          <head><title>${selectedEszkoz?.nev} - QR</title></head>
                          <body style="text-align: center; font-family: sans-serif; padding-top: 50px;">
                              <div style="border: 2px solid #eee; display: inline-block; padding: 20px; border-radius: 15px;">
                                  <h2 style="margin-bottom: 5px;">${selectedEszkoz?.nev}</h2>
                                  <p style="color: #666; margin-top: 0;">${selectedEszkoz?.tipus}</p>
                                  <img src="${qrImageUrl}" style="width: 250px; height: 250px;" onload="window.print(); window.close();" />
                                  <p style="font-weight: bold; font-size: 1.2rem;">SKU: ${selectedEszkoz?.sku}</p>
                              </div>
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
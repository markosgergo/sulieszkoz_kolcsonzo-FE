import { useState, useEffect } from "react";
import ApiService from "../../services/ApiService";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, TableContainer, Chip, Box, CircularProgress, Alert,
  Stack, Divider, IconButton
} from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import styles from "./SajatKolcsonzesek.module.css";

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
      const rendezettData = data.sort((a, b) => {
        if (!a.visszavetelDatuma && !!b.visszavetelDatuma) return -1;
        if (!!a.visszavetelDatuma && !b.visszavetelDatuma) return 1;
        return new Date(b.kiadasDatuma) - new Date(a.kiadasDatuma);
      });
      setKolcsonzesek(rendezettData);
    } catch (err) {
      setHiba("Nem sikerült betölteni a kölcsönzéseidet.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <CircularProgress size={50} thickness={4} />
    </Box>
  );

  return (
    <Container maxWidth="md" className={styles.container} sx={{ mt: 6, mb: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <HistoryIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Kölcsönzéseim
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Itt követheted nyomon az aktív és lezárt eszközhasználataidat.
          </Typography>
        </Box>
        <Chip 
          label={`${kolcsonzesek.length} tétel összesen`} 
          sx={{ fontWeight: 600, bgcolor: '#e0f2fe', color: '#0369a1' }} 
        />
      </Stack>

      {hiba && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>{hiba}</Alert>}

      <TableContainer component={Paper} className={styles.tablePaper} elevation={0}>
        <Table>
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell className={styles.headerCell}>Eszköz</TableCell>
              <TableCell className={styles.headerCell}>Időpontok</TableCell>
              <TableCell className={styles.headerCell} align="center">Állapot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolcsonzesek.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">Nincs még kölcsönzésed.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              kolcsonzesek.map((k) => {
                const isVisszahozva = !!k.visszavetelDatuma;
                const hataridoDate = new Date(k.hatarido);
                const ma = new Date();
                ma.setHours(0, 0, 0, 0);
                const isKesesben = !isVisszahozva && hataridoDate < ma;

                return (
                  <TableRow 
                    key={k.id} 
                    className={`
                        ${isVisszahozva ? styles.rowReturned : styles.rowActive} 
                        ${isKesesben ? styles.rowOverdue : ''}
                    `}
                  >
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography className={styles.deviceName}>
                        {k.eszkozNev}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        ID: #{k.eszkozId}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box className={styles.dateInfo}>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          <span className={styles.label}>KIVÉVE:</span> {k.kiadasDatuma ? new Date(k.kiadasDatuma).toLocaleDateString('hu-HU') : "-"}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: isKesesben ? 700 : 500,
                            color: isKesesben ? '#e11d48' : '#64748b'
                          }}
                        >
                          <span className={styles.label}>HATÁRIDŐ:</span> {k.hatarido}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      {isVisszahozva ? (
                        <Chip 
                          label="Visszahozva" 
                          size="small" 
                          sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 600 }}
                        />
                      ) : (
                        <Chip 
                          icon={isKesesben ? <WarningAmberIcon /> : undefined}
                          label={isKesesben ? "Késésben!" : "Nálad van"} 
                          color={isKesesben ? "error" : "primary"} 
                          sx={{ 
                            fontWeight: 700, 
                            px: 1,
                            animation: isKesesben ? 'pulse 2s infinite' : 'none'
                          }}
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

      <Typography variant="caption" sx={{ mt: 3, display: 'flex', alignItems: 'center', color: '#94a3b8', justifyContent: 'flex-end' }}>
        <InfoOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
        Az adatok valós időben frissülnek.
      </Typography>
    </Container>
  );
}
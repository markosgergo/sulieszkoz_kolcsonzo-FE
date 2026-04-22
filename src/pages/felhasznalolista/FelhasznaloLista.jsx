import { useState, useEffect } from "react";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Box, Button,
  IconButton, Tooltip, Stack, Select, MenuItem, Alert, Snackbar
} from "@mui/material";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "./FelhasznaloLista.module.css";

export default function FelhasznaloLista() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betoltesHiba, setBetoltesHiba] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [mentesAlatt, setMentesAlatt] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllFelhasznalo();
      setUsers(data);
    } catch {
      setBetoltesHiba("Nem sikerült betölteni a felhasználókat.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nev) => {
    if (!window.confirm(`Biztosan törölni szeretnéd ${nev} felhasználót?`)) return;
    try {
      await ApiService.deleteFelhasznalo(id);
      setUsers((prev) => prev.filter(u => (u.id || u.felhasznaloId) !== id));
      setSnackbar({ open: true, message: "Felhasználó sikeresen törölve!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Törlés sikertelen! Lehet aktív kölcsönzése van.", severity: "error" });
    }
  };

  const handleRoleChange = async (userId, ujSzerepkor) => {
    setMentesAlatt(userId);
    try {
      const frissitett = await ApiService.modositSzerepkor(userId, ujSzerepkor);
      setUsers((prev) =>
        prev.map(u =>
          (u.id || u.felhasznaloId) === userId
            ? { ...u, szerepkorNev: frissitett.szerepkorNev }
            : u
        )
      );
      setSnackbar({ open: true, message: `Szerepkör módosítva: ${frissitett.szerepkorNev}`, severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.hiba || "Szerepkör módosítása sikertelen!",
        severity: "error"
      });
    } finally {
      setMentesAlatt(null);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" className={styles.container} sx={{ mt: 6, mb: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <GroupIcon sx={{ fontSize: 35, color: '#3b82f6' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Felhasználók
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Rendszerfelhasználók jogköreinek és adatainak kezelése
          </Typography>
        </Box>
        <Button variant="outlined" component={Link} to="/" startIcon={<ArrowBackIcon />}>
          Vissza a főoldalra
        </Button>
      </Stack>

      {betoltesHiba && (
        <Alert severity="error" sx={{ mb: 2 }}>{betoltesHiba}</Alert>
      )}
      
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.headerCell}>ID</TableCell>
              <TableCell className={styles.headerCell}>Név</TableCell>
              <TableCell className={styles.headerCell}>E-mail cím</TableCell>
              <TableCell className={styles.headerCell} align="center">Szerepkör</TableCell>
              <TableCell className={styles.headerCell} align="center">Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  Nincsenek regisztrált felhasználók.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const userId = user.id || user.felhasznaloId;
                return (
                  <TableRow key={userId} className={styles.tableRow}>
                    <TableCell className={styles.idCell}>#{userId}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#334155' }}>{user.nev}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.email}</TableCell>
                    
                    <TableCell align="center">
                      <Select
                        size="small"
                        value={user.szerepkorNev || "FELHASZNALO"}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                        disabled={mentesAlatt === userId}
                        sx={{ 
                          minWidth: '140px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: user.szerepkorNev === "ADMIN"
                            ? 'error.main'
                            : user.szerepkorNev === "ALKALMAZOTT"
                            ? 'info.main'
                            : 'primary.main',
                          '.MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' }
                        }}
                      >
                        <MenuItem value="FELHASZNALO">FELHASZNALO</MenuItem>
                        <MenuItem value="ALKALMAZOTT">ALKALMAZOTT</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                      </Select>
                      {mentesAlatt === userId && (
                        <CircularProgress size={14} sx={{ ml: 1, verticalAlign: 'middle' }} />
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Felhasználó végleges törlése">
                        <IconButton
                          className={styles.deleteButton}
                          color="error"
                          onClick={() => handleDelete(userId, user.nev)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

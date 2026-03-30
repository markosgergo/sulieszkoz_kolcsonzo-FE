import { useState, useEffect } from "react";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Box, Button, IconButton, Tooltip, Stack 
} from "@mui/material";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

// CSS Modul import
import styles from "./FelhasznaloLista.module.css";

export default function FelhasznaloLista() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllFelhasznalo();
      setUsers(data);
    } catch (err) {
      console.error("Hiba a felhasználók betöltésekor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nev) => {
    if (window.confirm(`Biztosan törölni szeretnéd ${nev} felhasználót?`)) {
      try {
        await ApiService.deleteFelhasznalo(id);
        setUsers(users.filter(user => (user.id || user.felhasznaloId) !== id));
        alert("Felhasználó sikeresen törölve!");
      } catch (err) {
        alert("Nem sikerült törölni! Ellenőrizd, nincs-e aktív kölcsönzése.");
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" className={styles.container} sx={{ mt: 6, mb: 6 }}>
      {/* Fejléc rész */}
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
        
        <Button 
          variant="outlined" 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />}
          className={styles.backButton}
        >
          Vissza a főoldalra
        </Button>
      </Stack>
      
      {/* Táblázat */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.headerCell}>ID</TableCell>
              <TableCell className={styles.headerCell}>Név</TableCell>
              <TableCell className={styles.headerCell}>E-mail cím</TableCell>
              <TableCell className={styles.headerCell} align="center">Jogkör</TableCell>
              <TableCell className={styles.headerCell} align="center">Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">Nincsenek regisztrált felhasználók.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const userId = user.id || user.felhasznaloId;
                const isAdmin = user.szerepkorNev === "ADMIN";
                
                return (
                  <TableRow key={userId} className={styles.tableRow}>
                    <TableCell className={styles.idCell}>#{userId}</TableCell>
                    <TableCell>
                        <Typography sx={{ fontWeight: 700, color: '#334155' }}>
                            {user.nev}
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.szerepkorNev} 
                        size="small" 
                        color={isAdmin ? "secondary" : "primary"}
                        variant={isAdmin ? "contained" : "outlined"}
                        sx={{ 
                            fontWeight: 700, 
                            minWidth: '90px',
                            borderRadius: '8px',
                            fontSize: '0.7rem'
                        }}
                      />
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
      
      {/* Alsó összesítő */}
      <Box sx={{ mt: 3, p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9' }}>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Összesen <strong style={{ color: '#475569' }}>{users.length}</strong> aktív felhasználó a rendszerben
        </Typography>
      </Box>
    </Container>
  );
}
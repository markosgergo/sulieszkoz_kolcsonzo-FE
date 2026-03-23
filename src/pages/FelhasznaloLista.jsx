import { useState, useEffect } from "react";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Box, Button, IconButton, Tooltip 
} from "@mui/material";
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService";
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete'; // Törlés ikon

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

  // TÖRLÉS FUNKCIÓ
  const handleDelete = async (id, nev) => {
    if (window.confirm(`Biztosan törölni szeretnéd ${nev} felhasználót?`)) {
      try {
        await ApiService.deleteFelhasznalo(id);
        // Frissítjük a listát (eltávolítjuk a töröltet az állapotból, hogy ne kelljen újra tölteni az egészet)
        setUsers(users.filter(user => (user.id || user.felhasznaloId) !== id));
        alert("Felhasználó sikeresen törölve!");
      } catch (err) {
        console.error("Hiba a törlés során:", err);
        alert("Nem sikerült törölni a felhasználót! (Lehet, hogy van aktív kölcsönzése?)");
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Felhasználók kezelése
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Vissza
        </Button>
      </Box>
      
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Név</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>E-mail cím</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Jog</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Nincsenek regisztrált felhasználók.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const userId = user.id || user.felhasznaloId;
                return (
                  <TableRow key={userId} hover>
                    <TableCell>#{userId}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{user.nev}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.szerepkorNev} 
                        size="small" 
                        color={user.szerepkorNev === "ADMIN" ? "secondary" : "primary"}
                        sx={{ fontWeight: 'bold', minWidth: '80px' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {/* Törlés gomb */}
                      <Tooltip title="Felhasználó törlése">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(userId, user.nev)}
                          // Opcionális: Az admin ne tudja saját magát törölni (ha tudjuk a saját ID-nkat)
                        >
                          <DeleteIcon />
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
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Összesen: <strong>{users.length}</strong> regisztrált tag
        </Typography>
      </Box>
    </Container>
  );
}
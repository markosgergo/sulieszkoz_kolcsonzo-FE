import { useState, useEffect } from "react";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Box, Button 
} from "@mui/material";
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService";
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FelhasznaloLista() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await ApiService.getAllFelhasznalo();
      setUsers(data);
    } catch (err) {
      console.error("Hiba a felhasználók betöltésekor:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Felső rész: Cím és Vissza gomb egymás mellett */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Felhasználók
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Azonosító</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Név</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>E-mail cím</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Jogosultság</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  Nincsenek regisztrált felhasználók.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id || user.felhasznaloId} hover>
                  <TableCell>#{user.id || user.felhasznaloId}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{user.nev}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={user.szerepkorNev} 
                      size="small" 
                      color={user.szerepkorNev === "ADMIN" ? "secondary" : "primary"}
                      variant="filled"
                      sx={{ fontWeight: 'bold', minWidth: '80px' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Alsó információs sáv és még egy vissza gomb */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Összesen: <strong>{users.length}</strong> regisztrált tag
        </Typography>
        <Button 
          variant="text" 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />}
        >
          Vissza a főoldalra
        </Button>
      </Box>
    </Container>
  );
}
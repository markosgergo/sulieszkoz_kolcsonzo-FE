import { useState, useEffect } from "react";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip, CircularProgress, Box 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../services/ApiService";

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

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) {
      try {
        await ApiService.deleteFelhasznalo(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert("Hiba történt a törlés során!");
      }
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Regisztrált felhasználók
      </Typography>
      
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Név</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Szerepkör</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>#{user.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{user.nev}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.szerepkorNev} 
                    size="small" 
                    color={user.szerepkorNev === "ADMIN" ? "error" : "primary"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(user.id)}
                    disabled={user.szerepkorNev === "ADMIN"} // Az admint ne lehessen véletlenül törölni
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
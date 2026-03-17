import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AccountMenu from "./AccountMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar position="static" elevation={3}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Suli Eszközkölcsönző
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button color="inherit" component={Link} to="/">Főoldal</Button>
          
          {user && (
            <>
              <Button color="inherit" component={Link} to="/eszkozok">Eszközök</Button>
              {/* Ha admin vagy alkalmazott, csak akkor lássa az Új eszközt (opcionális finomítás) */}
              {(user.szerepkor === 'ADMIN' || user.szerepkor === 'ALKALMAZOTT') && (
                <Button color="inherit" component={Link} to="/eszkozok/uj">Új eszköz</Button>
              )}
            </>
          )}

          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">Bejelentkezés</Button>
              <Button variant="outlined" color="inherit" component={Link} to="/regisztracio" sx={{ ml: 1 }}>
                Regisztráció
              </Button>
            </>
          ) : (
            <AccountMenu />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
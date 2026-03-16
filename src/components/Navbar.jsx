import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AccountMenu from "./AccountMenu"; // Ez az a komponens, ami a képeden a jobb szélen van

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Suli Eszközkölcsönző
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">Főoldal</Button>
          
          {user && (
            <>
              <Button color="inherit" component={Link} to="/eszkozok">Eszközök</Button>
              <Button color="inherit" component={Link} to="/eszkozok/uj">Új eszköz</Button>
            </>
          )}

         {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">Bejelentkezés</Button>
              <Button color="inherit" component={Link} to="/regisztracio">Regisztráció</Button>
            </>
          ) : (
            <AccountMenu />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", mr: 3 }}
        >
          Suli Eszközkölcsönző
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Főoldal
          </Button>
          <Button color="inherit" component={Link} to="/eszkozok">
            Eszközök
          </Button>
          <Button color="inherit" component={Link} to="/eszkozok/uj">
            Új eszköz
          </Button>
          <Button color="inherit" component={Link} to="/kolcsonzesek/uj">
            Új kölcsönzés
          </Button>
          <Button color="inherit" component={Link} to="/kolcsonzesek/sajat">
            Saját kölcsönzések
          </Button>
        </Box>

        {user ? (
          <Button color="inherit" onClick={handleLogout}>
            Kilépés
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Bejelentkezés
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
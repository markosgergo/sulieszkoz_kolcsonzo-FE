import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import AccountMenu from "./AccountMenu";

export default function Navbar() {
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

          <Button color="inherit" component={Link} to="/login">
            Bejelentkezés
          </Button>
        </Box>

        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
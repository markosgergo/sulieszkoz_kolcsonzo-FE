import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountMenu from "../accountmenu/AccountMenu";
import styles from "./Navbar.module.css"; 

export default function Navbar() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const navLinks = [
    { label: "Főoldal", to: "/" },
    ...(user ? [{ label: "Készlet", to: "/eszkozok" }] : []),
    ...(user?.szerepkorNev === "ADMIN" ? [{ label: "+ Új eszköz", to: "/eszkozok/uj", admin: true }] : []),
  ];

  return (
    <AppBar position="sticky" elevation={0} className={styles.navBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            className={styles.logo}
            sx={{ flexGrow: 1, textDecoration: "none" }}
          >
            Suli Eszközkölcsönző
          </Typography>

          {/* Asztali navigáció */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                className={`${styles.navButton} ${link.admin ? styles.adminButton : ""}`}
              >
                {link.label}
              </Button>
            ))}

            <Box sx={{ width: "1px", height: "24px", bgcolor: "rgba(255,255,255,0.1)", mx: 1 }} />

            {!user ? (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button component={Link} to="/login" className={styles.navButton}>Belépés</Button>
                <Button variant="contained" component={Link} to="/regisztracio" className={`${styles.navButton} ${styles.registerButton}`}>
                  Fiók létrehozása
                </Button>
              </Box>
            ) : (
              <AccountMenu />
            )}
          </Box>

          {/* Mobil: hamburger + avatar */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
            {user && <AccountMenu />}
            <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobil drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 270, height: "100%", bgcolor: "#0f172a", color: "white", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="subtitle1" fontWeight="800" sx={{ color: "white" }}>Menü</Typography>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <List sx={{ flex: 1 }}>
            {navLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton component={Link} to={link.to} onClick={toggleDrawer(false)}
                  sx={{ color: link.admin ? "#4ade80" : "#94a3b8", "&:hover": { bgcolor: "rgba(255,255,255,0.06)", color: "white" } }}
                >
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {!user && (
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />
              <Button fullWidth variant="outlined" component={Link} to="/login" onClick={toggleDrawer(false)}
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", textTransform: "none", fontWeight: 700 }}>
                Belépés
              </Button>
              <Button fullWidth variant="contained" component={Link} to="/regisztracio" onClick={toggleDrawer(false)}
                sx={{ bgcolor: "#2563eb", textTransform: "none", fontWeight: 700 }}>
                Fiók létrehozása
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
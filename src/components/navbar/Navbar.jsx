import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import AccountMenu from "../accountmenu/AccountMenu";
import styles from "./Navbar.module.css"; 

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar position="sticky" elevation={0} className={styles.navBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            className={styles.logo}
            sx={{ flexGrow: 1, textDecoration: 'none' }}
          >
            Suli Eszközkölcsönző
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button 
              component={Link} 
              to="/" 
              className={styles.navButton}
            >
              Főoldal
            </Button>
            
            {user && (
              <>
                <Button 
                  component={Link} 
                  to="/eszkozok" 
                  className={styles.navButton}
                >
                  Készlet
                </Button>
                
                {(user.szerepkorNev === 'ADMIN' || user.szerepkorNev === 'ALKALMAZOTT') && (
                  <Button 
                    component={Link} 
                    to="/eszkozok/uj" 
                    className={`${styles.navButton} ${styles.adminButton}`}
                  >
                    + Új eszköz
                  </Button>
                )}
              </>
            )}

            <Box sx={{ width: '1px', height: '24px', bgcolor: 'rgba(255,255,255,0.1)', mx: 1 }} />

            {!user ? (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button 
                  component={Link} 
                  to="/login" 
                  className={styles.navButton}
                >
                  Belépés
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/regisztracio" 
                  className={`${styles.navButton} ${styles.registerButton}`}
                >
                  Fiók létrehozása
                </Button>
              </Box>
            ) : (
              <AccountMenu />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, Box 
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Importáljuk a CSS modult
import styles from "./AccountMenu.module.css";

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <IconButton 
        onClick={handleClick} 
        size="small" 
        className={styles.avatarButton}
      >
        <Avatar 
          sx={{ width: 36, height: 36, bgcolor: "#2563eb", fontWeight: 700 }}
        >
          {user?.nev?.charAt(0) || "U"}
        </Avatar>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        // Itt adjuk át a stílust a lebegő menünek
        PaperProps={{
          className: styles.menuPaper,
          elevation: 0
        }}
      >
        <div className={styles.userInfo}>
            <Typography className={styles.userName}>
                {user?.nev}
            </Typography>
            <Typography className={styles.userEmail}>
                {user?.email}
            </Typography>
        </div>

        <MenuItem onClick={() => navigate("/profil")} className={styles.menuItem}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profilom
        </MenuItem>

        <MenuItem onClick={() => navigate("/sajat-kolcsonzesek")} className={styles.menuItem}>
          <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
          Kölcsönzéseim
        </MenuItem>

        {user?.szerepkorNev === 'ADMIN' && (
          <MenuItem onClick={() => navigate("/admin/kolcsonzesek")} className={`${styles.menuItem} styles.adminItem`}>
            <ListItemIcon><AdminPanelSettingsIcon fontSize="small" sx={{ color: '#16a34a' }} /></ListItemIcon>
            Adminisztráció
          </MenuItem>
        )}

        <Divider sx={{ my: '0 !important' }} />
        
        <MenuItem onClick={handleLogout} className={`${styles.menuItem} ${styles.logoutItem}`}>
          <ListItemIcon><Logout fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
          Kijelentkezés
        </MenuItem>
      </Menu>
    </>
  );
}
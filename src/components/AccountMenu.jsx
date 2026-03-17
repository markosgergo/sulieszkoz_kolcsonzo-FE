import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider 
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History"; // Ikon a kölcsönzésekhez
import PersonIcon from "@mui/icons-material/Person";

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
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
      >
        <MenuItem onClick={() => navigate("/profil")}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profilom
        </MenuItem>

        {/* ÚJ FÜL: Saját kölcsönzések */}
        <MenuItem onClick={() => navigate("/sajat-kolcsonzesek")}>
          <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
          Saját kölcsönzéseim
        </MenuItem>

        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Kijelentkezés
        </MenuItem>
      </Menu>
    </>
  );
}
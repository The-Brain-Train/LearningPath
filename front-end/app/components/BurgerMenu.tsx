import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; 
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useSession } from "next-auth/react";
import { useCookies } from 'react-cookie';
import jwtDecode from "jwt-decode";


export default function BurgerMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const isOpen = Boolean(anchorEl);
  const [cookies, setCookie] = useCookies(["user"]);

  if (cookies.user) {
    var user = jwtDecode(cookies.user);
  }
  
  const [, , removeCookie] = useCookies(["user"]);
  const handleSignOut = () => {
    removeCookie("user", {
      path: "/"
    });
    router.push("/")
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
     <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          onClick={isOpen ? handleClose : handleClick}
          size="small"
          sx={{  
            transition: 'transform 0.3s ease', 
            transform: isOpen ? 'rotate(90deg)' : 'none', 
        }}
          aria-controls={isOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? 'true' : undefined}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isOpen}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => router.push("/")}>
        <HomeIcon /> <p className='pl-2'>Home</p>
        </MenuItem>
        <MenuItem onClick={() => router.push("/create")}>
          <CreateIcon /> <p className='pl-2'>Create</p>
        </MenuItem>
        <MenuItem onClick={() => router.push("/explore")}>
        <ExploreIcon /> <p className='pl-2'>Explore</p>
        </MenuItem>
        <MenuItem onClick={() => router.push("/myprofile")}>
          <AccountCircleIcon /> <p className='pl-2'>My Profile</p>
        </MenuItem>
        <MenuItem onClick={() => router.push("/signin")}>
          <AccountCircleIcon /> <p className='pl-2'>Sign in</p>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <AccountCircleIcon /> <p className='pl-2'>Sign out</p>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

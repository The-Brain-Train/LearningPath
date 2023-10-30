import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { useState } from "react";

export default function BurgerMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const isOpen = Boolean(anchorEl);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  if (cookies.user) {
    var user = jwtDecode(cookies.user);
  }

  const handleSignOut = () => {
    setTimeout(() => {
      removeCookie("user", {
        path: "/",
      });
    }, 50);
    router.push("/");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
      <div className="sm:hidden">
        <IconButton
          onClick={isOpen ? handleClose : handleClick}
          size="small"
          sx={{
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(90deg)" : "none",
          }}
          aria-controls={isOpen ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : undefined}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={isOpen}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem onClick={() => router.push("/")}>
            <HomeIcon /> <p className="pl-2">Home</p>
          </MenuItem>
          <MenuItem onClick={() => router.push("/create")}>
            <CreateIcon /> <p className="pl-2">Create</p>
          </MenuItem>
          <MenuItem onClick={() => router.push("/explore")}>
            <ExploreIcon /> <p className="pl-2">Explore</p>
          </MenuItem>
          <MenuItem onClick={() => router.push("/profile")}>
            <AccountCircleIcon /> <p className="pl-2">My Profile</p>
          </MenuItem>
          {cookies.user ? (
            <MenuItem onClick={handleSignOut}>
              <LoginIcon /> <p className="pl-2">Sign Out</p>
            </MenuItem>
          ) : (
            <MenuItem onClick={() => router.push("/signin")}>
              <LogoutIcon />{" "}
              <div className="flex flex-col">
                <p className="pl-2">SignIn / </p>
                <p className="pl-2">SignUp</p>
              </div>
            </MenuItem>
          )}
        </Menu>
      </div>
      <div className="hidden sm:flex">
        
        <MenuItem onClick={() => router.push("/create")}>
          <CreateIcon /> <p className="pl-2">Create</p>
        </MenuItem>
        <MenuItem onClick={() => router.push("/explore")}>
          <ExploreIcon /> <p className="pl-2">Explore</p>
        </MenuItem>
        {cookies.user ? (
          <MenuItem onClick={handleSignOut}>
            <LoginIcon /> <p className="pl-2">Sign Out</p>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => router.push("/signin")}>
            <LogoutIcon />{" "}
            <div className="flex flex-col">
              <p className="pl-2">SignIn / </p>
              <p className="pl-2">SignUp</p>
            </div>
          </MenuItem>
        )}
      </div>
    </Box>
  );
}

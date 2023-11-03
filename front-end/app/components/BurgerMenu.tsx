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
import { useState } from "react";
import { BurgerMenuProps } from "../util/types";
import { Modal, Typography, Button } from "@mui/material";

export default function BurgerMenu({ handleSignOut }: BurgerMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const isOpen = Boolean(anchorEl);
  const [cookies] = useCookies(["user"]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleShut = () => setOpen(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box className="flex items-center text-center">
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
            <MenuItem onClick={handleOpen}>
              <LoginIcon /> <p className="pl-2">Sign Out</p>
            </MenuItem>
          ) : (
            <div>
              <MenuItem onClick={() => router.push("/signin")}>
                <LogoutIcon /> <p className="pl-2">Sign In</p>
              </MenuItem>
              <MenuItem onClick={() => router.push("/signup")}>
                <LogoutIcon /> <p className="pl-2">Sign Up</p>
              </MenuItem>
            </div>
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
          <MenuItem onClick={handleOpen}>
            <LoginIcon /> <p className="pl-2">Sign Out</p>
          </MenuItem>
        ) : (
          <div className="flex flex-row">
            <MenuItem onClick={() => router.push("/signin")}>
              <LogoutIcon /> <p className="pl-2">Sign In</p>
            </MenuItem>
            <MenuItem onClick={() => router.push("/signup")}>
              <LogoutIcon /> <p className="pl-2">Sign Up</p>
            </MenuItem>
          </div>
        )}
      </div>
      <Modal open={open} onClose={handleShut}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 lg:w-96 bg-white rounded shadow-lg p-4 rounded-5">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to Sign out?
          </Typography>
          <div className="flex justify-between">
            <Button onClick={handleShut}>no</Button>
            <Button
              className="text-red-600"
              onClick={() => {
                handleShut();
                handleSignOut();
              }}
            >
              {" "}
              yes
            </Button>
          </div>
        </Box>
      </Modal>
    </Box>
  );
}

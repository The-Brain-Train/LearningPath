import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from '@mui/icons-material/Notifications';
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
import { PromptMessage } from "./PromptMessage";
import { getUnreadNotificationsOfUser } from "../functions/httpRequests";
import { useQuery } from "@tanstack/react-query";

export default function BurgerMenu(props: BurgerMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const isOpen = Boolean(anchorEl);
  const [cookies] = useCookies(["user"]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleShut = () => setOpen(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: unreadNotifications } = useQuery(
    ["unreadNotifications"],
    () => getUnreadNotificationsOfUser(props.currentUser?.email as string, cookies.user),
    {
      enabled: !!props.currentUser,
    }
  );

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
            <MenuItem onClick={() => router.push("/signin")}>
              <LogoutIcon />{" "}
              <p className="pl-2 flex flex-col">
                <span>Sign In</span>
              </p>
            </MenuItem>
          )}
        </Menu>
      </div>
      <div className="hidden sm:flex">
        <MenuItem onClick={() => { setNotificationsVisible(!notificationsVisible) }}>
          <div className="relative">
            <div className="flex flex-row items-center">
              <NotificationsIcon className="my-5" />
              <p className="pl-2">Notifications</p>
            </div>
            {notificationsVisible && <div className="absolute w-36 right-0 bg-white rounded-md shadow-xl z-10">
              {unreadNotifications &&
                unreadNotifications.map((n, index) => (
                  <a
                    href="#"
                    key={index}
                    className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-500 hover:text-gray-50">
                    {n.message}
                  </a>
                ))
              }
            </div>}
          </div>
        </MenuItem>

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
          <MenuItem onClick={() => router.push("/signin")}>
            <LogoutIcon /> <p className="pl-2">Sign In</p>
          </MenuItem>
        )}
      </div>
      <PromptMessage
        type="warning"
        open={open}
        onClose={handleShut}
        onConfirm={() => {
          handleShut();
          props.handleSignOut();
        }}
        message="Sign out?"
        confirmText="YES"
        cancelText="NO"
      />
    </Box>
  );
}

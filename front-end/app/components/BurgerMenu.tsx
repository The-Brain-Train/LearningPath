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
import { useCookies } from "react-cookie";
import { useState } from "react";
import { BurgerMenuProps } from "../util/types";
import { PromptMessage } from "./PromptMessage";
import Link from "next/link";

export default function BurgerMenu(props: BurgerMenuProps) {
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
              <LogoutIcon /> <p className="pl-2">Sign out</p>
            </MenuItem>
          ) : (
            <div className="my-3 ml-7">
              <Link
                type="button"
                className=" text-white w-full bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2 text-center"
                href={"/signin"}
              >
                Sign in
              </Link>
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
          null
        ) : (
          <Link
            type="button"
            className="mt-2 ml-4 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            href={"/signin"}
          >
            Sign in
          </Link>
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

import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../burgermenu.css";

type BurgerMenuPorps = {
  show: boolean;
};

function BurgerMenu({ show }: BurgerMenuPorps) {
  return (
    <ul className={`space-y-1 burgermenu ${show && "burgermenu_show"}`}>
      <li>
        <a
          href="/"
          className="flex items-center justify-end gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700"
        >
          <HomeIcon />

          <span className="text-sm font-medium w-20"> Home </span>
        </a>
      </li>

      <li>
        <a
          href="/create"
          className="flex justify-end gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <CreateIcon />

          <span className="text-sm font-medium w-20"> Create </span>
        </a>
      </li>

      <li>
        <a
          href="/explore"
          className="flex  justify-end gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ExploreIcon />
          <span className="text-sm font-medium w-20"> Explore </span>
        </a>
      </li>

      <li>
        <a
          href=""
          className="flex justify-end gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <AccountCircleIcon />
          <span className="text-sm font-medium w-20"> My Profile </span>
        </a>
      </li>
    </ul>
  );
}

export default BurgerMenu;

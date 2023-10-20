"use client";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import { useCookies } from 'react-cookie';
import jwtDecode from "jwt-decode";
import { User } from "../util/types";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [cookies, setCookie] = useCookies(["user"]);
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (cookies.user) {
      const decodedUser = jwtDecode(cookies.user) as User;
      setCurrentUser(decodedUser);
    } else {
      setCurrentUser(null);
    }
  }, [cookies.user]);

  return (
    <>
      <header className="bg-white fixed w-full h-16	z-50 top-0 left-0">
        <div className="flex h-16 items-center justify-between mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="LP Logo"
              width={120}
              height={60}
            />
          </Link>
          <div className="flex flex-row">
            {currentUser ? (
              <Link href="/profile" className="flex gap-1 mr-3 items-center">
                <AccountCircleSharpIcon/>
                {currentUser && (
                  <p>
                    {currentUser.name
                      ? currentUser.name.split(" ")[0]
                      : "No name"}
                    {currentUser.name && currentUser.name.split(" ").length > 1
                      ? "..."
                      : ""}
                  </p>
                )}
              </Link>
            ) : null}
            <BurgerMenu />
          </div>
        </div>
      </header>
    </>
  );
}

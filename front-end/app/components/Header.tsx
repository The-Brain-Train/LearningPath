"use client";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import { useCookies } from 'react-cookie';
import jwtDecode from "jwt-decode";
import { User } from "../types";
import { useState, useEffect } from "react";


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
          <Link
            href="/"
            className="flex text-xl font-semibold subpixel-antialiased font-serif	"
          >
            <img
              src="/learningpath-logo-cropped.png"
              alt="LP Logo"
              className="h-10"
            />
            <span
              style={{
                fontFamily: "Roboto",
                fontWeight: 900,
                marginTop: "5px",
                marginLeft: "10px",
              }}
            >
              LearningPath
            </span>
          </Link>
          <div className="flex flex-row">
          {currentUser ? <p>{currentUser.name}</p> : null}
            <BurgerMenu />
          </div>
        </div>
      </header>
    </>
  );
}

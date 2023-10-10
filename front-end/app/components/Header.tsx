"use client";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";



export default function Header() {


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
          <BurgerMenu />
          </div>
        </div>
      </header>
    </>
  );
}

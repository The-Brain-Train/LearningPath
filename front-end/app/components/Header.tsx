"use client";
import Link from "next/link";
import BurgerMenu from "./BurgerMenu";

export default function Header() {
  return (
    <>
      <header className="bg-white fixed w-full h-16	">
          <div className="flex h-16 items-center justify-between mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">            
              <Link href="/" className="flex text-xl font-semibold subpixel-antialiased font-serif	">
                <img src="/learningpath-logo-cropped.png" alt="LP Logo" className="h-10" />
                 Learning Path
              </Link>
              <BurgerMenu />
          </div>
      </header>
    </>
  );
}

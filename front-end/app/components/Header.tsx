"use client";
import BurgerMenu1 from "./BurgerMenu1";

export default function Header() {
  return (
    <>
      <header className="bg-white fixed w-full h-16	">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">            
              <a className="block text-teal-600" href="/">
                <span className="sr-only">Home</span>
                <img src="/learningpath-logo-cropped.png" alt="LP Logo" className="h-10" />
              </a>
              <BurgerMenu1 />
          </div>
        </div>
      </header>
    </>
  );
}

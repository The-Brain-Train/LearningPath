"use client";
import BurgerMenu from "./BurgerMenu";
import Image from "next/image"
import Link from "next/link";

type HeaderProp = {
  userImage: string | null | undefined;
}

export default function Header({userImage}: HeaderProp) {

  const userPic = userImage ? (
    <Link href="/myprofile">
      <Image
        className="dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto"
        src={userImage}
        width={40}
        height={40}
        alt={"Profile Pic"}
        priority={true}
      />
  </Link>
) : null


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
          {userPic}
          <BurgerMenu />
          </div>
        </div>
      </header>
    </>
  );
}

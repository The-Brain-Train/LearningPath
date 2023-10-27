"use client";
import BurgerMenu from "./BurgerMenu";
import Link from "next/link";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { User } from "../util/types";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getUserProfilePicture } from "../functions/httpRequests";

export default function Header() {
  const [cookies] = useCookies(["user"]);

  const { data: currentUser } = useQuery<User | null>(
    ["currentUser"],
    async () => {
      if (cookies.user) {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      }
      return null;
    }
  );

  const { data: profilePictureUrl } = useQuery<string>(
    ["profilePictureUrl"],
    () => getUserProfilePicture(currentUser?.email as string, cookies.user),
    {
      enabled: !!currentUser,
    }
  );

  return (
    <>
      <header className="bg-white fixed w-full h-16	z-50 top-0 left-0">
        <div className="flex h-16 items-center justify-between mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image src="/Logo.png" alt="LP Logo" width={140} height={60} />
          </Link>
          <div className="flex flex-row">
            {currentUser ? (
              <Link href="/profile" className="flex gap-1 mr-3 items-center">
                <div className="h-8 w-8 relative rounded-full overflow-hidden">
                  {profilePictureUrl ? (
                    <Image
                      src={profilePictureUrl}
                      width={35}
                      height={35}
                      alt="User profile picture"
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/icon-profile.png"
                      width={35}
                      height={35}
                      alt="Default profile picture"
                    />
                  )}
                </div>

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

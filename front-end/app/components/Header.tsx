"use client";
import Link from "next/link";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { User } from "../util/types";
import Image from "next/legacy/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfilePicture } from "../functions/httpRequests";
import BurgerMenu from "./BurgerMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import NotificationPane from "./NotificationPane";
import { useState } from "react";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      const tokenString = Array.isArray(token) ? token[0] : token;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      setCookie("user", tokenString, {
        path: "/",
        sameSite: "none",
        secure: true,
        expires: expirationDate
      });
      router.push("/");
    }
  }, [token, setCookie, router]);

  const { data: currentUser } = useQuery<User | null>(
    ["currentUser"],
    async () => {
      const user = jwtDecode(cookies.user) as User | null;
      return user;
    },
    {
      enabled: !!cookies.user,
    }
  );

  const { data: profilePictureUrl } = useQuery<string>(
    ["profilePictureUrl"],
    () => getUserProfilePicture(currentUser?.email as string, cookies.user),
    {
      enabled: !!currentUser,
    }
  );

  const handleSignOut = () => {
    removeCookie("user");
    queryClient.removeQueries(["currentUser"]);
    queryClient.removeQueries(["profilePictureUrl"]);
    router.push("/");
  };

  return (
    <>
      <header className="bg-white fixed w-full h-16	z-50 top-0 left-0">
        <div className="flex h-16 items-center justify-between mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image
              className="h-14 w-auto"
              src="/Logo.png"
              alt="LP Logo"
              width={150}
              height={60}
              priority
            />
          </Link>
          <div className="flex flex-row-reverse">
            {currentUser ? (
              <Link href="/profile" className="flex gap-1 sm:mr-0 mr-3 items-center">
                <div className="h-8 w-8 relative rounded-full overflow-hidden">
                  {profilePictureUrl ? (
                    <Image
                      src={profilePictureUrl}
                      width={35}
                      height={35}
                      alt="User profile picture"
                      className="rounded-full w-auto"
                      layout="fixed"
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
                {/* <p>
                  {currentUser && currentUser.name
                    ? currentUser.name.length > 5
                      ? currentUser.name.substring(0, 5) + "..."
                      : currentUser.name
                    : "No name"}
                </p> */}
              </Link>
            ) : null}
            {currentUser &&
              <NotificationPane
                currentUser={currentUser}
                cookieUserToken={cookies.user}
                notificationsVisible={notificationsVisible}
                onIconClick={() => {
                  setNotificationsVisible(!notificationsVisible)
                }}
              />
            }
            <BurgerMenu
              handleSignOut={handleSignOut}
              currentUser={currentUser}
            />
          </div>
        </div>
      </header>
    </>
  );
}
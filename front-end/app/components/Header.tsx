"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { User } from '../util/types';
import { getUserProfilePicture } from '../functions/httpRequests';
import { useRouter } from 'next/navigation';

const DynamicBurgerMenu = dynamic(() => import('./BurgerMenu'));

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>(undefined);
  const router = useRouter();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = jwtDecode(cookies.user) as User | null;
        setCurrentUser(user);

        if (user) {
          const pictureUrl = await getUserProfilePicture(user.email, cookies.user);
          setProfilePictureUrl(pictureUrl);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (cookies.user) {
      fetchUserData();
    }
  }, [cookies.user]);

  useEffect(() => {
    const updateProfilePicture = async () => {
      try {
        if (currentUser) {
          const newPictureUrl = await getUserProfilePicture(currentUser.email, cookies.user);
          setProfilePictureUrl(newPictureUrl);
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    };

    updateProfilePicture();
  }, [currentUser, cookies.user]);

  const handleSignOut = () => {
    setCurrentUser(null);
    setProfilePictureUrl(undefined);
    removeCookie("user");
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
              width={140}
              height={60}
              priority={false}
            />
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
                <p>
                  {currentUser && currentUser.name
                    ? currentUser.name.length > 5
                      ? currentUser.name.substring(0, 5) + '...'
                      : currentUser.name
                    : 'No name'}
                </p>
              </Link>
            ) : null}
            <DynamicBurgerMenu handleSignOut={handleSignOut} />
          </div>
        </div>
      </header>
    </>
  );
}


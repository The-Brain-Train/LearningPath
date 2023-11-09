import React from "react";
import Image from "next/image";
import Link from "next/link";

const ProfilePageUnauthUser = () => {
  return (
    <main className="main-background min-h-max gap-5 text-center items-center rounded-lg text-xl text-white pt-40">
      <p className="mb-4 font-bold text-3xl">You are not logged in</p>
      <Image
        src="/roadmap3.jpeg"
        alt="Create Roadmap"
        className="m-auto rounded-full"
        height={250}
        width={250}
      />
      <div className="flex flex-col mt-4 gap-2">
        <Link href="/signup" className="hover:text-blue-500 underline text-2xl">
          Create an account
        </Link>
        <span className="text-2xl"> or </span>
        <Link href="/signin" className="hover:text-blue-500 underline text-2xl">
          Sign in
        </Link>
      </div>
    </main>
  );
};

export default ProfilePageUnauthUser;

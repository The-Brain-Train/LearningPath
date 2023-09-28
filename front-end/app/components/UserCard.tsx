import Image from "next/image";
import { UserCardProps } from "../types";

export default function Card({ user }: UserCardProps) {
  const userImage = user?.image ? (
    <Image
      className="border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto "
      src={user?.image}
      width={150}
      height={150}
      alt={user?.name ?? "Profile Pic"}
      priority={true}
    />
  ) : null;

  return (
    <section className="flex flex-col gap-1 ">
      <div className="flex flex-col text-center items-center p-6  rounded-lg font-bold text-2xl text-white">
        Hello {user?.name}!
      </div>
      {userImage}
    </section>
  );
}

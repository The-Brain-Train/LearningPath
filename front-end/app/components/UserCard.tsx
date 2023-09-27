import Image from "next/image";
import { CardProps } from "../types";

export default function Card({ user }: CardProps) {
  const userImage = user?.image ? (
    <Image
      className="border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8"
      src={user?.image}
      width={200}
      height={200}
      alt={user?.name ?? "Profile Pic"}
      priority={true}
    />
  ) : null;

  return (
    <section className="flex flex-col gap-1 mt-20">
      <div className="flex flex-col text-center items-center p-6 bg-white rounded-lg font-bold text-5xl text-black">
        Hello {user?.name}!
      </div>
      {userImage}
    </section>
  );
}

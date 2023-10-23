import { UserCardProps } from "../util/types";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";

export default function Card({ user }: UserCardProps) {
  return (
    <section className="flex flex-col gap-1 ">
      <div className="flex flex-col text-center items-center p-6  rounded-lg font-bold text-2xl text-white">
        Hello {user?.name}!
      </div>
      <div
        className="border-4 dark:border-slate-500 drop-shadow-xl text-slate-300 rounded-full mx-auto "
      >
        <AccountCircleSharpIcon className="sm:h-32" style={{ width: '200px', height: '200px' }}/>
      </div>
    </section>
  );
}

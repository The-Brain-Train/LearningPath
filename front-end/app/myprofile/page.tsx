"use client";
import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { deleteRoadmap, getUsersRoadmapMetas } from "../functions/httpRequests";
import { useSession } from "next-auth/react";
import { RoadMapMetaList } from "../types";
import Link from "next/link";
import DeleteModal from "../components/DeleteModal";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }: { id: string | number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const page = () => {
  const { data: session } = useSession();
  const [userRoadmaps, setUserRoadmaps] = useState<RoadMapMetaList | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const handleDelete = async (id: string) => {
    await deleteRoadmap(id);
    setUserRoadmaps((prevRoadmaps) => {
      if (!prevRoadmaps) return prevRoadmaps;
      return {
        roadMapMetaList: prevRoadmaps.roadMapMetaList?.filter(
          (roadmap) => roadmap.id !== id
        ),
      };
    });
  };

  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      if (!session || !session.user || !session.user.email) {
        return;
      }
      const currentUser = session.user.email;
      const roadmapMetas = await getUsersRoadmapMetas(currentUser);
      setUserRoadmaps(roadmapMetas);
    };

    fetchUserRoadmaps();
  }, [session]);

  return (
    <main className="main-background min-h-max ">
      <div className="flex items-center flex-col pb-3">
        <UserCard user={session?.user} />
      </div>
      <div className="mx-2">
        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="bg-slate-300 p-3 dark:border-opacity-50"
          >
            <h2>My Roadmaps</h2>
          </AccordionHeader>
          <AccordionBody>
            <ul className="flex flex-col justify-center">
              {userRoadmaps?.roadMapMetaList.map((meta, index) => (
                <li
                  key={index}
                  className="bg-slate-300 shadow-md w-full border-t-2 border-opacity-100 dark:border-opacity-50"
                >
                  <div className="flex justify-between items-center p-2">
                    <Link
                      className="card-list-text card-body text-left overflow-hidden"
                      href={`/explore/${meta.id}`}
                    >
                      <p className="lyric-card-name overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
                        {meta.name}
                      </p>
                    </Link>
                    <div className="flex-shrink-0 min-w-max">
                      <DeleteModal
                        id={meta.id}
                        onDelete={(id) => handleDelete(id)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="bg-slate-300 p-3 border-t-2 border-black"
          >
            My Favourites
          </AccordionHeader>
          <AccordionBody>
            <ul className="flex flex-col justify-center">
              {userRoadmaps?.roadMapMetaList.map((meta, index) => (
                <li
                  key={index}
                  className="bg-slate-300 shadow-md w-full border-t-2 border-opacity-100 dark:border-opacity-50"
                >
                  <div className="flex justify-between items-center p-2">
                    <Link
                      className="card-list-text card-body text-left overflow-hidden"
                      href={`/explore/${meta.id}`}
                    >
                      <p className="lyric-card-name overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
                        {meta.name}
                      </p>
                    </Link>
                    <div className="flex-shrink-0 min-w-max">
                      <DeleteModal
                        id={meta.id}
                        onDelete={(id) => handleDelete(id)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </AccordionBody>
        </Accordion>
      </div>
    </main>
  );
};

export default page;

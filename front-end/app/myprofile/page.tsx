"use client";
import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import {
  deleteRoadmap,
  getUserFavorites,
  getUsersRoadmapMetas,
} from "../functions/httpRequests";
import { useSession } from "next-auth/react";
import { RoadmapMeta, RoadmapMetaList } from "../types";
import Link from "next/link";
import DeleteModal from "../components/DeleteModal";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import PersonalRoadmapCard from "../components/PersonalRoadmapCard";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import FavoriteRoadmapCard from "../components/FavoriteRoadmapCard";

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
  const [userRoadmaps, setUserRoadmaps] = useState<RoadmapMetaList | undefined>(
    undefined
  );
  const [favorites, setFavorites] = useState<RoadmapMeta[]>([]);
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const handleDelete = async (id: string) => {
    await deleteRoadmap(id);
    setUserRoadmaps((prevRoadmaps) => {
      if (!prevRoadmaps) return prevRoadmaps;
      return {
        roadmapMetaList: prevRoadmaps.roadmapMetaList?.filter(
          (roadmap) => roadmap.id !== id
        ),
      };
    });
  };

  const fetchUserRoadmaps = async () => {
    if (!session || !session.user || !session.user.email) {
      return;
    }
    const roadmapMetas = await getUsersRoadmapMetas(session.user.email);
    setUserRoadmaps(roadmapMetas);
  };

  const fetchUserFavorites = async () => {
    if (!session || !session.user || !session.user.email) {
      return;
    }
    const favoriteRoadmaps = await getUserFavorites(session?.user?.email);
    setFavorites(favoriteRoadmaps);
  };

  useEffect(() => {
    fetchUserRoadmaps();
    fetchUserFavorites();
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
            className="p-3 dark:border-opacity-50 text-white"
            style={{ backgroundColor: "#141832" }}
          >
            <h2>My Roadmaps</h2>
          </AccordionHeader>
          <AccordionBody>
            <ul className="flex flex-col justify-center">
              {userRoadmaps?.roadmapMetaList.map((roadmapMeta, index) => (
                <PersonalRoadmapCard
                  roadmapMeta={roadmapMeta}
                  key={index}
                  handleDelete={handleDelete}
                />
              ))}
            </ul>
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="p-3 dark:border-opacity-50 text-white"
            style={{ backgroundColor: "#141832" }}
          >
            My Favourites
          </AccordionHeader>
          <AccordionBody>
            <ul className="flex flex-col justify-center">
              {favorites.map((roadmapMeta, index) => (
                <FavoriteRoadmapCard roadmapMeta={roadmapMeta} key={index} />
              ))}
            </ul>
          </AccordionBody>
        </Accordion>
      </div>
    </main>
  );
};

export default page;

"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { RoadmapMeta, User } from "../types";
import { RoadmapMetaList } from "../types";
import {
  deleteRoadmap,
  getUserFavorites,
  getUsersRoadmapMetas,
  removeRoadmapMetaFromUserFavorites,
} from "../functions/httpRequests";
import UserCard from "../components/UserCard";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import PersonalRoadmapCard from "../components/PersonalRoadmapCard";
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

const Profile = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRoadmaps, setUserRoadmaps] = useState<RoadmapMetaList | undefined>(
    undefined
  );
  const [favorites, setFavorites] = useState<RoadmapMeta[]>([]);
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const handleDelete = async (roadmapMeta: RoadmapMeta) => {
    await deleteRoadmap(roadmapMeta.id);
    setUserRoadmaps((prevRoadmaps) => {
      if (!prevRoadmaps) return prevRoadmaps;
      return {
        roadmapMetaList: prevRoadmaps.roadmapMetaList?.filter(
          (roadmap) => roadmap.id !== roadmapMeta.id
        ),
      };
    });
  };

  const fetchUserRoadmaps = async () => {
    try {
      if (currentUser?.email) {
        const roadmapMetas = await getUsersRoadmapMetas(
          currentUser.email,
          cookies.user
        );
        setUserRoadmaps(roadmapMetas);
      }
    } catch (error) {
      console.error("Error fetching user roadmaps:", error);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      if (currentUser?.email) {
        const favoriteRoadmaps = await getUserFavorites(
          currentUser?.email,
          cookies.user
        );
        setFavorites(favoriteRoadmaps);
      }
    } catch (error) {
      console.error("Error fetching user roadmaps:", error);
    }
  };

  useEffect(() => {
    if (cookies.user) {
      const decodedUser: User | null = jwtDecode(cookies.user);
      setCurrentUser(decodedUser);
    }
  }, [cookies.user]);

  useEffect(() => {
    if (currentUser) {
      fetchUserRoadmaps();
      fetchUserFavorites();
    }
  }, [currentUser, cookies.user]);

  const handleRemoveFromFavorites = async (roadmapMeta: RoadmapMeta) => {
    try {
      await removeRoadmapMetaFromUserFavorites(currentUser?.email, roadmapMeta);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== roadmapMeta.id)
      );
    } catch (error) {
      console.error("Error removing roadmap from favorites:", error);
    }
  };

  return (
    <>
      <main className="main-background min-h-max ">
        <div className="flex items-center flex-col pb-3">
          {currentUser && <UserCard user={currentUser} />}
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
              {favorites ? (
                <ul className="flex flex-col justify-center">
                  {favorites.map((roadmapMeta, index) => (
                    <FavoriteRoadmapCard
                      removeFavorite={handleRemoveFromFavorites}
                      roadmapMeta={roadmapMeta}
                      key={index}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300">Your favorites list is empty.</p>
              )}
            </AccordionBody>
          </Accordion>
        </div>
      </main>
    </>
  );
};

export default Profile;

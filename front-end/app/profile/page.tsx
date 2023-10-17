"use client";
import React, { useState} from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { RoadmapMeta, User } from "../types";
import { RoadmapMetaList } from "../types";
import { useRouter } from "next/navigation";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [cookies] = useCookies(["user"]);
  const router = useRouter();
  const [open, setOpen] = useState(0);
  const queryClient = useQueryClient();

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

  const { data: userRoadmaps } = useQuery<RoadmapMetaList | undefined>(
    ["userRoadmaps"],
    () => getUsersRoadmapMetas(currentUser?.email as string, cookies.user),
    {
      enabled: !!currentUser,
    }
  );

  const { data: favorites } = useQuery<RoadmapMeta[]>(
    ["favorites"],
    () => getUserFavorites(currentUser?.email as string, cookies.user),
    {
      enabled: !!currentUser,
    }
  );

  const deleteRoadmapMutation = useMutation((roadmapMeta: RoadmapMeta) =>
    deleteRoadmap(roadmapMeta.id)
  );

  const removeFavoriteMutation = useMutation((roadmapMeta: RoadmapMeta) =>
    removeRoadmapMetaFromUserFavorites(
      currentUser?.email,
      roadmapMeta,
      cookies.user
    )
  );

  const handleDelete = async (roadmapMeta: RoadmapMeta) => {
    try {
      await deleteRoadmapMutation.mutateAsync(roadmapMeta);
      queryClient.invalidateQueries(["userRoadmaps"]);
    } catch (error) {
      console.error("Error deleting roadmap:", error);
    }
  };

  const handleRemoveFromFavorites = async (roadmapMeta: RoadmapMeta) => {
    try {
      await removeFavoriteMutation.mutateAsync(roadmapMeta);
      queryClient.invalidateQueries(["favorites"]);
    } catch (error) {
      console.error("Error removing roadmap from favorites:", error);
    }
  };

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <>
      {currentUser ? (
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
                  <p className="text-slate-300">
                    Your favorites list is empty.
                  </p>
                )}
              </AccordionBody>
            </Accordion>
          </div>
        </main>
      ) : (
        <div className="main-background min-h-max  text-center items-center pt-20 rounded-lg font-bold text-xl text-white ">
          <p>Please sign in to view your profile.</p>
          <button
            className="bg-transparent hover:bg-emerald-600text-lg text-white font-bold border-2 p-2 mt-2 border-white rounded "
            style={{ backgroundColor: "#141832" }}
            onClick={() => router.push("/signin")}
          >
            Sign in / Sign up
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;

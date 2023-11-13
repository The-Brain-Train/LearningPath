"use client";
import React, { useState } from "react";
import { RoadmapMeta, UserProps } from "../util/types";
import { RoadmapMetaList } from "../util/types";
import {
  deleteRoadmap,
  getUserFavorites,
  getUsersRoadmapMetas,
  removeRoadmapMetaFromUserFavorites,
  getRoadmapCountOfUser,
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
import { useCookies } from "react-cookie";
import { Icon } from "../components/AccordionIcon";

const ProfilePageAuthUser = ({ currentUser }: UserProps) => {
  const [open, setOpen] = useState(0);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);

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

  const { data: roadmapCount } = useQuery<number>(
    ["roadmapCount"],
    () => getRoadmapCountOfUser(currentUser?.email as string, cookies.user),
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
    <main className="main-background min-h-max ">
      <section className="flex items-center flex-col pb-3">
        {currentUser && <UserCard currentUser={currentUser} />}
      </section>
      <div className="flex items-center flex-col mx-2">
        {!roadmapCount && (
          <p className="text-center text-white font-semibold pb-4">
            No roadmaps saved
          </p>
        )}
        {roadmapCount != undefined && roadmapCount > 0 && (
          <p className="text-center text-white font-semibold pb-4">
            {roadmapCount} / 10 roadmaps saved
          </p>
        )}
        <Accordion
          className="sm:max-w-2xl"
          open={open === 1}
          icon={<Icon id={1} open={open} />}
        >
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="p-3 dark:border-opacity-50 text-white"
            style={{ backgroundColor: "#141832" }}
          >
            My Roadmaps
          </AccordionHeader>
          <AccordionBody className="py-0">
            {userRoadmaps && userRoadmaps.roadmapMetaList.length > 0 ? (
              <ul className="flex flex-col justify-center">
                {userRoadmaps?.roadmapMetaList.map((roadmapMeta, index) => (
                  <PersonalRoadmapCard
                    roadmapMeta={roadmapMeta}
                    key={index}
                    handleDelete={handleDelete}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-slate-300">You have no roadmaps.</p>
            )}
          </AccordionBody>
        </Accordion>
        <Accordion
          className="sm:max-w-2xl"
          open={open === 2}
          icon={<Icon id={2} open={open} />}
        >
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="p-3 dark:border-opacity-50 text-white"
            style={{ backgroundColor: "#141832" }}
          >
            My Favourites
          </AccordionHeader>
          <AccordionBody className="py-0">
            {favorites && favorites.length > 0 ? (
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
  );
};

export default ProfilePageAuthUser;

"use client";
import React, { useState } from "react";
import { RoadmapMeta, User } from "../util/types";
import { RoadmapMetaList } from "../util/types";
import {
  deleteRoadmap,
  getUserFavorites,
  getUsersRoadmapMetas,
  removeRoadmapMetaFromUserFavorites,
  getRoadmapCountOfUser
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
import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "../components/AccordionIcon";
import { Box, CircularProgress } from "@mui/material";

const Profile = () => {
  const [open, setOpen] = useState(0);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);

  const { data: currentUser, isLoading } = useQuery<User | null>(
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

  const { data: roadmapCount } = useQuery<number>(
    ["roadmapCount"],
    () => getRoadmapCountOfUser(currentUser?.email as string, cookies.user),
    {
      enabled: !!currentUser,
    }
  );

  const maxRoadmaps = 10;
  const progressBooks = [];

  if (roadmapCount) {
    progressBooks.length = 0;
    for (let i = 0; i < roadmapCount; i++) {
      progressBooks.push(
        <Image
          src="/navigation.png"
          width={35}
          height={35}
          alt=""
        />
      );
    }
    for (let i = 0; i < maxRoadmaps - roadmapCount; i++) {
      progressBooks.push(
        <Image
          src="/route.png"
          width={35}
          height={35}
          alt=""
        />
      );
    }
  }

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

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
      <Box className="flex justify-center items-center flex-col" >
        <CircularProgress color="inherit" size={150} />
      </Box>
    </div>
    );
  }

  return (
    <>
      {currentUser ? (
        <main className="main-background min-h-max ">
          <div className="flex items-center flex-col pb-3">
            {currentUser && <UserCard user={currentUser} />}
          </div>

          <div className="flex items-center flex-col mx-2">
            <p className="text-center text-white font-semibold">
              {roadmapCount} / {maxRoadmaps} roadmaps saved
            </p>

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
                  <p className="text-slate-300">
                    Your favorites list is empty.
                  </p>
                )}
              </AccordionBody>
            </Accordion>
          </div>
        </main>
      ) : (
        <div className="main-background min-h-max gap-5 text-center items-center pt-20 rounded-lg text-xl text-white ">
          <p className="font-semibold text-lg">
            Please{" "}
            <Link href="/signin" className="hover:text-blue-500 underline ">
              SignIn/SignUp
            </Link>{" "}
            to view your profile.
          </p>
          <Image
            src="/roadmap3.jpeg"
            alt="Create Roadmap"
            className="m-auto rounded-full"
            height={100}
            width={100}
          />
        </div>
      )}
    </>
  );
};

export default Profile;

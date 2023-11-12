"use client";
import React, { useEffect } from "react";
import IndentedTreeWithData from "@/app/explore/[roadmapsid]/IndentedTreeWithData";
import {
  addRoadmapMetaToUserFavorites,
  getRoadmap,
  getRoadmaps,
  getRoadmapsFilteredPaged,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
} from "@/app/functions/httpRequests";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, IconButton } from "@mui/material";
import useCurrentUserQuery from "@/app/functions/useCurrentUserQuery";
import { useCookies } from "react-cookie";
import { Roadmap, RoadmapMeta, RoadmapMetaList } from "@/app/util/types";
import { FavoriteButton } from "./FavoriteButton";

type Props = {
  params: {
    roadmapsid: string;
  };
};

function RoadMapId(props: Props) {
  const router = useRouter();
  const roadmapId = props.params.roadmapsid;
  const queryClient = useQueryClient();
  const itemsPerPage = 9;
  const [cookies] = useCookies(["user"]);
  const { data: roadmapMetas } = useQuery<RoadmapMetaList>(
    ["roadmapMetas"], getRoadmaps
  );
  const { currentUser } = useCurrentUserQuery();

  const fetchUserFavorites = async () => {
    return await getUserFavorites(
      currentUser ? currentUser?.email : null,
      cookies.user
    );
  };

  const { data: favorites, refetch: refetchFavorites } = useQuery(
    ["favorites"],
    fetchUserFavorites,
    {
      enabled: !!currentUser,
    }
  );

  const {
    data: roadmaps,
    isLoading: roadmapsLoading,
    isError: roadmapsError,
  } = useQuery(["roadmaps"], () => {
    const page: number = queryClient.getQueryData(["thisPage"])
      ? queryClient.getQueryData<number>(["thisPage"]) || 0
      : 0;
    return getRoadmapsFilteredPaged("", "", 0, 500, page, itemsPerPage);
  });

  const {
    data: roadmapData,
    isLoading,
    isError,
  } = useQuery(
    ["roadmap", roadmapId],
    async () => {
      if (roadmaps) {
        const foundRoadmap = roadmaps.content.find(
          (roadmap: Roadmap) => roadmap.id === roadmapId
        );
        if (foundRoadmap) {
          const roadmapData = await getRoadmap(foundRoadmap.roadmapReferenceId);
          return JSON.parse(roadmapData.obj);
        }
      }
      return null;
    },
    {
      enabled: !!roadmapId && !roadmapsLoading && !roadmapsError,
    }
  );

  const isRoadmapInFavorites = favorites?.some(
    (favorite: RoadmapMeta) => favorite.id === roadmapId
  );

  const toggleFavorite = async () => {
    const matchingRoadmapMeta = findRoadmapMeta(roadmapId);
    if (!matchingRoadmapMeta) {
      console.error(`RoadmapMeta not found for roadmapId: ${roadmapId}`);
      return;
    }
    if (isRoadmapInFavorites) {
      await removeRoadmapMetaFromUserFavorites(
        currentUser?.email,
        matchingRoadmapMeta,
        cookies.user
      );
    } else {
      await addRoadmapMetaToUserFavorites(
        currentUser?.email,
        matchingRoadmapMeta,
        cookies.user
      );
    }
    refetchFavorites();
  };

  const findRoadmapMeta = (roadmapId: string): RoadmapMeta | undefined => {
    if (roadmapMetas == undefined) return;
    return roadmapMetas.roadmapMetaList.find(
      (roadmapMeta: RoadmapMeta) => roadmapMeta.id === roadmapId
    );
  };

  if (isError) {
    return (
      <main className="bg-white">
        <div className="w-full flex items-center justify-center h-screen">
          <p className="text-red-500 font-bold">Error fetching roadmap.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="bg-white">
        <div className="w-full flex items-center justify-center h-screen">
          <Box className="flex justify-center items-center flex-col">
            <CircularProgress color="inherit" size={150} />
          </Box>
        </div>
      </main>
    );
  }

  return (
    <main className="main-background">
      <div className="flex flex-col px-3 justify-center items-center">
        <div className="max-w-screen-xl">
          <div className="flex items-center justify-between my-5">
            <div>
              <ArrowBack
                fontSize="large"
                className="text-slate-300 m-3 cursor-pointer"
                onClick={() => {
                  queryClient.invalidateQueries(["roadmaps"]);
                  router.back();
                }}
              />
            </div>
            <div className="flex-grow text-center">
              {currentUser && (
                <FavoriteButton
                  onClick={toggleFavorite}
                  isFavorite={isRoadmapInFavorites}
                />
              )}
            </div>
          </div>
          <IndentedTreeWithData data={roadmapData} />
        </div>
      </div>
    </main>
  );
}

export default RoadMapId;

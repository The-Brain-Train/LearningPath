"use client";
import React from "react";
import IndentedTreeWithData from "@/app/explore/[roadmapmetaid]/IndentedTreeWithData";
import {
  addRoadmapMetaToUserFavorites,
  getRoadmaps,
  getRoadmapByMetaId,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
  updateUsersCompletedTopic,
  getRoadmapProgressOfUser,
} from "@/app/functions/httpRequests";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import useCurrentUserQuery from "@/app/functions/useCurrentUserQuery";
import { useCookies } from "react-cookie";
import {
  Roadmap,
  RoadmapMeta,
  RoadmapMetaList,
  TreeNode,
} from "@/app/util/types";
import { FavoriteButton } from "./FavoriteButton";
import { ResourcesSection } from "../../components/ResourcesSection";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";

type Props = {
  params: {
    roadmapmetaid: string;
  };
};

function RoadMapId(props: Props) {
  const router = useRouter();
  const roadmapMetaId = props.params.roadmapmetaid;
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const {
    data: roadmapMetas,
  } = useQuery<RoadmapMetaList>(["roadmapMetas"], getRoadmaps);

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
    data: roadmap,
    isLoading,
    isError,
  } = useQuery<Roadmap>(["roadmap", roadmapMetaId], async () => {
    const roadmap = await getRoadmapByMetaId(roadmapMetaId);
    return JSON.parse(roadmap.obj);
  });

  const isRoadmapInFavorites = favorites?.some(
    (favorite: RoadmapMeta) => favorite.id === roadmapMetaId
  );

  const toggleFavorite = async () => {
    const matchingRoadmapMeta = findRoadmapMeta(roadmapMetaId);
    if (!matchingRoadmapMeta) {
      console.error(`RoadmapMeta not found for roadmapId: ${roadmapMetaId}`);
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

  const userOwnsRoadmap = () => {
    const roadmapMeta = findRoadmapMeta(roadmapMetaId);
    if (
      currentUser &&
      roadmapMeta &&
      currentUser?.email === roadmapMeta?.userEmail
    ) {
      return true;
    }
    return false;
  };

  const findRoadmapMeta = (roadmapId: string): RoadmapMeta | undefined => {
    if (roadmapMetas == undefined) return;
    return roadmapMetas.roadmapMetaList.find(
      (roadmapMeta: RoadmapMeta) => roadmapMeta.id === roadmapId
    );
  };

  const handleUpdateUsersCompletedTopic = async (completedTask: string) => {
    try {
      if (currentUser?.email && roadmapMetaId) {
        const isCreator = userOwnsRoadmap();
        if (!isCreator) {
          console.error("Permission denied: User is not the creator");
          return;
        }
        const updatedRoadmap: Roadmap | undefined = await updateUsersCompletedTopic(
          currentUser.email,
          roadmapMetaId,
          completedTask,
          cookies.user
        );
        queryClient.invalidateQueries(["roadmap", roadmapMetaId]);
        queryClient.invalidateQueries([`progressPercentage-${roadmapMetaId}`, progressPercentage]);
        return updatedRoadmap;
      }
    } catch (error) {
      console.error("Error updating completed topic:", error);
    }
  };

  const { data: progressPercentage } = useQuery<number>(
    [`progressPercentage-${roadmapMetaId}`],
    () => getRoadmapProgressOfUser(currentUser?.email, roadmapMetaId, cookies.user),
  );

  const roadmapToTreeNode = (roadmap: Roadmap | undefined) => {
    return roadmap as unknown as TreeNode;
  };

  const treeNode = roadmapToTreeNode(roadmap);

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
        <div className="max-w-screen-xl parent-roadmap-container">
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

            {!isSmallScreen ? (
              <div className="w-1/2 items-center justify-center mx-4">
                <p className="text-white pb-2">Progress: {progressPercentage}%</p>
                <LinearProgress variant="determinate" value={progressPercentage} className="w-full" />
              </div>) : (
              <div className="items-center justify-center mx-6">
                <CircularProgressWithLabel value={progressPercentage} size={50} />
              </div>
            )}
          </div>
          <IndentedTreeWithData data={roadmapToTreeNode(roadmap)} updateCompletedTopic={handleUpdateUsersCompletedTopic} isCreator={userOwnsRoadmap()} />
          <ResourcesSection
            treeNode={treeNode}
            userOwnsRoadmap={userOwnsRoadmap()}
            queriesToInvalidate={["roadmap"]}
            roadmapId={roadmapMetaId}
            userEmail={currentUser?.email}
            cookiesUser={cookies.user}
          />
        </div>
      </div>
    </main>
  );
}

export default RoadMapId;

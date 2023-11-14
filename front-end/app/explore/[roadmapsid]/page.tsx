"use client";
import React from "react";
import IndentedTreeWithData from "@/app/explore/[roadmapsid]/IndentedTreeWithData";
import {
  addRoadmapMetaToUserFavorites,
  getRoadmaps,
  getRoadmapByMetaId,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
} from "@/app/functions/httpRequests";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import useCurrentUserQuery from "@/app/functions/useCurrentUserQuery";
import { useCookies } from "react-cookie";
import { Roadmap, RoadmapMeta, RoadmapMetaList, TreeNode } from "@/app/util/types";
import { FavoriteButton } from "./FavoriteButton";
import Link from "next/link";

type Props = {
  params: {
    roadmapsid: string;
  };
};

function RoadMapId(props: Props) {

  const router = useRouter();
  const roadmapId = props.params.roadmapsid;
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);

  const {
    data: roadmapMetas,
    isLoading: roadmapsLoading,
    isError: roadmapsError,
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
  } = useQuery<Roadmap>(["roadmap", roadmapId], async () => {
    const roadmap = await getRoadmapByMetaId(roadmapId);
    return JSON.parse(roadmap.obj);
  });

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

  const roadmapToTreeNode = (roadmap: Roadmap) => {
    return roadmap as unknown as TreeNode;
  }

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
          <IndentedTreeWithData data={roadmapToTreeNode(roadmap)} />

          <div className="mt-10 flex flex-left">
            <p className="text-xl text-center font-bold text-white md:text-2xl">
              Resources to follow
            </p> </div>
          <div className="mt-5 mx-10">
            {treeNode && treeNode.resources && treeNode.resources.map(r =>
              // <p> {r.name}</p>
              <table className="table-fixed w-full">
                {/* <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Link</th>
                  </tr>
                </thead> */}
                <tbody>
                  <tr className="py-10">
                    <td>
                      {r.type}
                    </td>
                    <td>{r.name}</td>
                    <td>
                      <Link href={r.link} target="_blank" rel="noopener noreferrer">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                        Visit Site
                      </button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>

            )
            }



          </div>




        </div>
      </div>
    </main>
  );
}

export default RoadMapId;

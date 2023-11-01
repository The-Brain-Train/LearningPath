"use client";
import React from "react";
import IndentedTreeWithData from "@/app/components/IndentedTreeWithData";
import { getRoadmap, getRoadmaps } from "@/app/functions/httpRequests";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";

type Props = {
  params: {
    roadmapsid: string;
  };
};

function RoadMapId(props: Props) {
  const router = useRouter();
  const roadmapId = props.params.roadmapsid;

  const {
    data: roadmaps,
    isLoading: roadmapsLoading,
    isError: roadmapsError,
  } = useQuery(["roadmaps"], getRoadmaps, {
    enabled: !!roadmapId,
  });

  const {
    data: roadmapData,
    isLoading,
    isError,
  } = useQuery(
    ["roadmap", roadmapId],
    async () => {
      if (roadmaps) {
        const foundRoadmap = roadmaps.roadmapMetaList.find(
          (roadmap) => roadmap.id === roadmapId
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
      <ArrowBack
        fontSize="medium"
        className="text-slate-300 m-3 mt-4"
        onClick={() => router.back()}
      />
      <IndentedTreeWithData data={roadmapData} />
    </main>
  );
}

export default RoadMapId;

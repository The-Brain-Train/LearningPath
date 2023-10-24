"use client";

import React from "react";
import IndentedTreeWithData from "@/app/components/IndentedTreeWithData";
import { getRoadmap, getRoadmaps } from "@/app/functions/httpRequests";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type Props = {
  params: {
    roadmapsid: string;
  };
};


function RoadMapId(props: Props) {
  const router = useRouter();

  const { data: roadmaps, isLoading, isError } = useQuery(
    ["roadmaps"],
    getRoadmaps
  );

  const roadmapId = props.params.roadmapsid;

  const { data: roadmapData } = useQuery(
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
      return undefined;
    }
  );

  return (
    <main className="main-background">
      {isError ? (
        <p className="text-red-500 font-bold">Error fetching roadmap.</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ArrowBack
            fontSize="medium"
            className="text-slate-300 m-3 mt-4"
            onClick={() => router.back()}
          />
          <IndentedTreeWithData data={roadmapData} />
        </>
      )}
    </main>
  );
}

export default RoadMapId;
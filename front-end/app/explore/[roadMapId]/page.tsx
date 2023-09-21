"use client";
import IndentedTreeWithData from "@/app/components/IndentedTreeWithData";
import { getRoadmap, getRoadmaps } from "@/app/functions/httpRequests";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    roadMapId: string;
  };
};

export default function roadMapId(props: Props) {
  const [roadMap, setRoadmap] = useState<JSON | null>(null);
  const router = useRouter();
  const [roadMapRefId, setRoadMapRefId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadmaps = await getRoadmaps();
        const foundRoadmap = roadmaps.roadMapMetaList.find(
          (roadmap) => roadmap.id === props.params.roadMapId
        );

        if (foundRoadmap) {
          const roadMapRefId = foundRoadmap.roadMapReferenceId;
          setRoadMapRefId(roadMapRefId);
          const roadmapData = await getRoadmap(roadMapRefId);
          const parsedData = JSON.parse(roadmapData.obj);
          setRoadmap(parsedData);
        } else {
          console.error("Roadmap not found");
        }
      } catch (error) {
        setError(`Error fetching roadmap. Error: ${error}`);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="main-background">
      {error ? (
        <p  className="text-red-500 font-bold">{error}</p>
      ) : (
        <>
          <ArrowBack
            fontSize="medium"
            className="text-slate-300 m-3 mt-4"
            onClick={() => router.back()}
          />
          <IndentedTreeWithData
            data={roadMap}
            roadMapRefId={props.params.roadMapId}
          />
        </>
      )}
    </main>
  );
}

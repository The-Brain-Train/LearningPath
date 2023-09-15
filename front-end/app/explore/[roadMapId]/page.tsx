"use client";
import IndentedTreeWithData from "@/app/components/IndentedTreeWithData";
import { getRoadmap } from "@/app/httpRequests";
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

  useEffect(() => {
    getRoadmap(props.params.roadMapId)
      .then((data) => JSON.parse(data.obj))
      .then((data) => setRoadmap(data));
  }, []);

  return (
    <main className="main-background">
      <ArrowBack fontSize="medium" className="text-slate-300 m-3 mt-4" onClick={() => router.back()} />
      <IndentedTreeWithData data={roadMap} />
    </main>
  );
}

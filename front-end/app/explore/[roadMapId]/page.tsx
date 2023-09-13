"use client"
import IndentedTreeWithData from "@/app/components/IndentedTreeWithData";
import { getRoadmap } from "@/app/httpRequests";
import { useEffect, useState } from "react";


type Props = {
  params: {
    roadMapId: string;
  };
};

export default function roadMapId(props: Props) {

  const [roadMap, setRoadmap] = useState();

  useEffect(()=> {
    getRoadmap(props.params.roadMapId)
    .then(data => JSON.parse(data.obj))
    .then(data => setRoadmap(data));
  }, [])


  return (
    <main>
      <IndentedTreeWithData data={roadMap} />
    
    </main>
  );
}

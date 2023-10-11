"use client";
import IndentedTreeWithData from "@/app/components/IndentedTreeWithData";
import { getRoadmap, getRoadmaps } from "@/app/functions/httpRequests";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { User } from "@/app/types";

type Props = {
  params: {
    roadmapId: string;
  };
};

export default function roadMapId(props: Props) {
  const [roadmap, setRoadmap] = useState<JSON | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (cookies.user) {
      const decodedUser: User | null = jwtDecode(cookies.user);
      setCurrentUser(decodedUser);
    }
    const fetchData = async () => {
      try {
        const roadmaps = await getRoadmaps(cookies.user);
        const foundRoadmap = roadmaps.roadmapMetaList.find(
          (roadmap) => roadmap.id === props.params.roadmapId
        );

        if (foundRoadmap) {
          const roadmapData = await getRoadmap(foundRoadmap.roadmapReferenceId, cookies.user);
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
  }, [cookies.user]);

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
            data={roadmap}
          />
        </>
      )}
    </main>
  );
}

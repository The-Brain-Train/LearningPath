"use client";
import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { deleteRoadmap, getUsersRoadmapMetas } from "../functions/httpRequests";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { RoadMapMetaList } from "../types";
import Link from "next/link";
import DeleteModal from "../components/DeleteModal";

const page = () => {
  const { data: session, status } = useSession();
  const [userRoadmaps, setUserRoadmaps] = useState<RoadMapMetaList | undefined>(
    undefined
  );

  // const handleSignInRedirect = () => {
  //   redirect("api/auth/signin?callbackUrl=/home");
  // };

  const handleDelete = async (id: string) => {
    await deleteRoadmap(id);
    setUserRoadmaps((prevRoadmaps) => {
      if (!prevRoadmaps) return prevRoadmaps;
      return {
        roadMapMetaList: prevRoadmaps.roadMapMetaList?.filter(
          (roadmap) => roadmap.id !== id
        ),
      };
    });
  };

  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      if (!session || !session.user || !session.user.email) {
        return;
      }
      const currentUser = session.user.email;
      const roadmapMetas = await getUsersRoadmapMetas(currentUser);
      setUserRoadmaps(roadmapMetas);
    };

    fetchUserRoadmaps();
  }, [session]);

  return (
    <main className="main-background min-h-max flex items-center flex-col">
      <UserCard user={session?.user} />
      <h2 className="pt-7 pl-2">My Roadmaps</h2>
      <div
        className="roadMaps-list"
        style={{ maxWidth: "300px", width: "80%" }}
      >
        <ul className="flex flex-col justify-center ">
          {userRoadmaps?.roadMapMetaList.map((meta, index) => (
            <li
              key={index}
              className="bg-slate-300 mb-5 rounded-lg shadow-md"
            >
              <div className="roadmap-list-card flex justify-between items-center p-3">
                <Link
                  className="card-list-text card-body text-left overflow-hidden"
                  href={`/explore/${meta.id}`}
                >
                  <p className="lyric-card-name overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {meta.name}
                  </p>
                </Link>
                <div className="flex-shrink-0 min-w-max">
                  <DeleteModal
                    id={meta.id}
                    onDelete={(id) => handleDelete(id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default page;

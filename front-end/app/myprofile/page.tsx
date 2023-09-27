"use client"
import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { getUsersRoadmapMetas } from "../functions/httpRequests";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { RoadMapMetaList } from "../types";

const page = () => {
  const { data: session, status } = useSession();
  const [userRoadmaps, setUserRoadmaps] = useState<RoadMapMetaList | undefined>(undefined);

  const handleSignInRedirect = () => {
    redirect("api/auth/signin?callbackUrl=/home");
  };

  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      if (!session || !session.user || !session.user.email) {
        return;
      }

      const currentUser = session.user.email;
      const roadmapMetas = await getUsersRoadmapMetas(currentUser);
      console.log(roadmapMetas);
      setUserRoadmaps(roadmapMetas);
    };

    fetchUserRoadmaps();
  }, [session]);

  return (
    <>
      <UserCard user={session?.user} pagetype={"My Profile"} />
      <h2>Your Roadmaps</h2>
      {(!session || !session.user || !session.user.email) ? (
        <div>
          <h1 className="text-5xl">You Shall Not Pass!</h1>
          <button onClick={handleSignInRedirect}>Log in</button>
        </div>
      ) : (
        userRoadmaps?.roadMapMetaList.map((meta, index) => (
          <p key={index}>{meta.name}</p>
        ))
      )}
    </>
  );
};

export default page;

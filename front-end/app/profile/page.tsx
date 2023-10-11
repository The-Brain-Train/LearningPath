"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { RoadmapMeta, User } from "../types";
import { RoadmapMetaList } from "../types";
import { getUserFavorites, getUsersRoadmapMetas } from "../functions/httpRequests";

const Profile = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userRoadmaps, setUserRoadmaps] = useState<RoadmapMetaList | undefined>(
    undefined
  );
  const [favorites, setFavorites] = useState<RoadmapMeta[]>([]);

  const fetchUserRoadmaps = async () => {
    try {
      if (currentUser?.email) { 
        const roadmapMetas = await getUsersRoadmapMetas(currentUser.email, cookies.user);
        setUserRoadmaps(roadmapMetas);
      }
    } catch (error) {
      console.error("Error fetching user roadmaps:", error);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      if (currentUser?.email) { 
        const favoriteRoadmaps = await getUserFavorites(currentUser?.email, cookies.user);
        setFavorites(favoriteRoadmaps);
      }
    } catch (error) {
      console.error("Error fetching user roadmaps:", error);
    }
  };

  useEffect(() => {
    if (cookies.user) {
      const decodedUser: User | null = jwtDecode(cookies.user);
      setCurrentUser(decodedUser);
    }
  }, [cookies.user]);

  useEffect(() => {
    fetchUserRoadmaps();
    fetchUserFavorites();
  }, [currentUser, cookies.user]);

  return (
    <div className="mt-20">
      <h1>My Page</h1>
      <div>
      {currentUser ? (
        <>
          <h2>Hi {currentUser.name}, you are signed in with the email {currentUser.email}</h2>
          <h3>My Roadmaps</h3>
          {userRoadmaps ? (
            userRoadmaps.roadmapMetaList.map((roadmapMeta: RoadmapMeta, index) => (
              <p key={index}>{roadmapMeta.name}</p>
            ))
          ): (
            <p>Loading Roadmaps</p>
          )}
        </>
      ) : (
        <p>Loading user information...</p>
      )}
      </div>
    </div>
  );
};

export default Profile;

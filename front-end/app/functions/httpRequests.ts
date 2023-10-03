import { RoadmapMetaList, Roadmap, RoadmapDTO, User } from "../types";

export const getRoadmaps = async () => {
  const response = await fetch(`http://localhost:8080/api/roadmaps`);
  if (!response.ok) {
    throw Error("Failed to fetch roadmaps");
  }
  const data: RoadmapMetaList = await response.json();
  return data;
};

export const getRoadmap = async (roadMapId: string) => {
  const response = await fetch(`http://localhost:8080/api/roadmaps/${roadMapId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: Roadmap = await response.json();
  return data;
};

export const deleteRoadmap = async (roadMapId: string) => {
  const response = await fetch(`http://localhost:8080/api/roadmaps/${roadMapId}`,{
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to delete roadmap");
  }
  return roadMapId;
};

export const postRoadmap = async (roadmap: RoadmapDTO) => {
  const response = await fetch(`http://localhost:8080/api/roadmaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roadmap),
  });
  if (!response.ok) {
    throw new Error("Failed to add roadmap");
  }
};

export const getUsersRoadmapMetas = async (userEmail: string) => {
  const response = await fetch(`http://localhost:8080/api/roadmaps/${userEmail}/roadmapMetas`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: RoadmapMetaList = await response.json();
  return data;
};

export const addUser = async (user: User) => {
  if (!user.email) {
    return;
  }
  try {
    const res = await fetch("http://localhost:8080/api/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to add user. Status code: ${res.status}`);
    }
  } catch (error) {
    console.error("Error adding user to DB:", error);
  }
};

import { Roadmap, RoadmapDTO, RoadmapMeta } from "./types";

export const getRoadmaps = async () => {
  const response = await fetch(`http://localhost:8080/api/roadmaps`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: RoadmapMeta[] = await response.json();
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
};

export const postRoadmap = async (roadMap: RoadmapDTO) => {
  const response = await fetch(`http://localhost:8080/api/roadmaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roadMap),
  });
  if (!response.ok) {
    throw new Error("Failed to add job");
  }

};

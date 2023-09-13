import { Roadmap, RoadmapMeta } from "./types";

export const getRoadmaps = async () => {
  const response = await fetch(`http://localhost:8080/api/roadmaps`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: RoadmapMeta[] = await response.json();
  return data;
};

export const getRoadmap = async (id: string) => {
  const response = await fetch(`http://localhost:8080/api/roadmaps/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: Roadmap = await response.json();
  return data;
};

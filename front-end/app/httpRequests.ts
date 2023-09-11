import { Roadmap } from "./types";

export const getRoadmaps = async () => {
  const response = await fetch(`http://localhost:8080/roadmaps`);
  if (!response.ok) {
    throw new Error("Failed to fetch roadmaps");
  }
  const data: Roadmap[] = await response.json();
  return data;
};

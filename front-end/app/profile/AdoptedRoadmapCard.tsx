// AdoptedRoadmapCard.jsx

import { PersonalRoadmapCardProps } from "../util/types";
import RoadmapCard from "./RoadmapCard";

export default function AdoptedRoadmapCard({
  currentUser,
  roadmapMeta,
  handleDelete,
}: PersonalRoadmapCardProps) {
  if (roadmapMeta.originalOwner) return null;

  return (
    <RoadmapCard
      currentUser={currentUser}
      roadmapMeta={roadmapMeta}
      handleDelete={handleDelete}
    />
  );
}

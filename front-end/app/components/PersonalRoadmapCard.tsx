import Link from "next/link";
import { PersonalRoadmapCardProps } from "../types";
import DeleteModal from "./DeleteModal";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";

export default function PersonalRoadmapCard({
  roadmapMeta,
  handleDelete,
}: PersonalRoadmapCardProps) {
  return (
    <li className="bg-slate-300 shadow-md w-full border-t-2 border-opacity-100 dark:border-opacity-50">
      <div className="flex items-center p-2">
        <Link
          className="text-left overflow-hidden flex flex-1 justify-center items-center"
          href={`/explore/${roadmapMeta.id}`}
        >
          <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1 flex-1">
            {roadmapMeta.name}
          </p>
          <div className="flex flex-col items-center justify-center">
            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
              {generateStarsforExperienceLevel(roadmapMeta.experienceLevel)}
            </p>
            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
              {roadmapMeta.hours} hours
            </p>
          </div>
        </Link>
        <div className="flex-shrink-0 min-w-max flex">
          
          <DeleteModal
            id={roadmapMeta.id}
            onDelete={(id) => handleDelete(id)}
          />
        </div>
      </div>
    </li>
  );
}

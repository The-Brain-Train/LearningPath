import Link from "next/link";
import { FavoriteRoadmapCardProps } from "../util/types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import { RemoveCircle} from "@mui/icons-material";

export default function FavoriteRoadmapCard({
  roadmapMeta,
  removeFavorite,
}: FavoriteRoadmapCardProps) {
  const handleRemoveFavoriteClick = () => {
    removeFavorite(roadmapMeta);
  };
  return (
    <li className="shadow-md w-full border-t-2 border-opacity-100 dark:border-opacity-50 bg-slate-300">
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
        <div className="flex-shrink-0 min-w-max flex mx-2 cursor-pointer">
          <RemoveCircle onClick={handleRemoveFavoriteClick} />
        </div>
      </div>
    </li>
  );
}

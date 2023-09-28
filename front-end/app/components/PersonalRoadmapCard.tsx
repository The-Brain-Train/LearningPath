import Link from "next/link";
import { PersonalRoadmapCardProps } from "../types";
import DeleteModal from "./DeleteModal";

export default function PersonalRoadmapCard({
  roadmapMeta,
  handleDelete,
}: PersonalRoadmapCardProps) {
  return (
    <li className="bg-slate-300 shadow-md w-full border-t-2 border-opacity-100 dark:border-opacity-50">
      <div className="flex justify-between items-center p-2">
        <Link
          className="card-list-text card-body text-left overflow-hidden"
          href={`/explore/${roadmapMeta.id}`}
        >
          <p className="lyric-card-name overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
            {roadmapMeta.name}
          </p>
        </Link>
        <div className="flex-shrink-0 min-w-max">
          <DeleteModal
            id={roadmapMeta.id}
            onDelete={(id) => handleDelete(id)}
          />
        </div>
      </div>
    </li>
  );
}

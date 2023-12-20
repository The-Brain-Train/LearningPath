import Link from "next/link";
import { PersonalRoadmapCardProps } from "../util/types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import Delete from "@mui/icons-material/Delete";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { getRoadmapProgressOfUser } from "../functions/httpRequests";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgressWithLabel from "../components/CircularProgressWithLabel";
import { PromptMessage } from "../components/PromptMessage";

export default function PersonalRoadmapCard({
  currentUser,
  roadmapMeta,
  handleDelete,
}: PersonalRoadmapCardProps) {

  if (!roadmapMeta.originalOwner) return null;

  const handleDeleteClick = () => {
    handleDelete(roadmapMeta);
    handleClose();
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cookies] = useCookies(["user"]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const { data: progressPercentage } = useQuery<number>(
    [`progressPercentage-${roadmapMeta.id}`],
    () => getRoadmapProgressOfUser(currentUser?.email, roadmapMeta.id, cookies.user),
  );

  return (
    <li className="shadow-md w-full border-t-2 border-opacity-100 dark:border-opacity-50 
    bg-[#42465a] text-white border-[#141832]">
      <div className="flex items-center p-2 h-16">
        <Link
          className="text-left overflow-hidden flex flex-1 justify-center items-center"
          href={`/explore/${roadmapMeta.id}`}
        >
          <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1 flex-1">
            {roadmapMeta.name}
          </p>
          {!isSmallScreen ? (
            <div className="w-1/2 items-center justify-center mx-4">
              <p>Progress: {progressPercentage}%</p>
              <LinearProgress variant="determinate" value={progressPercentage !== undefined ? progressPercentage : 0} className="w-full" />
            </div>) : (
            <div className="items-center justify-center mx-6">
              <CircularProgressWithLabel value={progressPercentage !== undefined ? progressPercentage : 0} size={50} />
            </div>
          )}
          <div className="flex flex-col items-center justify-center lg:w-1/6 xl:w-1/6 2xl:w-1/6">
            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
              {generateStarsforExperienceLevel(roadmapMeta.experienceLevel)}
            </p>
            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
              {roadmapMeta.hours} hours
            </p>
          </div>
        </Link>
        <div className="flex-shrink-0 min-w-max flex mx-2 cursor-pointer">
          <Delete id={roadmapMeta.id} onClick={handleOpen} />
        </div>
        <PromptMessage 
          type="warning"
          open={open}
          onClose={handleClose}
          onConfirm={handleDeleteClick}
          message="Are you sure you want to delete?"
          confirmText="YES"
          cancelText="NO"
        />
      </div>
    </li>
  );
}
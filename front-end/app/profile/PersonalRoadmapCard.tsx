import Link from "next/link";
import { PersonalRoadmapCardProps } from "../util/types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import Delete from "@mui/icons-material/Delete";
import { useState } from "react";
import { Box, Button, Modal, Typography, LinearProgress } from "@mui/material";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoadmapProgressOfUser } from "../functions/httpRequests";

export default function PersonalRoadmapCard({
  currentUser,
  roadmapMeta,
  handleDelete,
}: PersonalRoadmapCardProps) {
  const handleDeleteClick = () => {
    handleDelete(roadmapMeta);
    handleClose();
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);

  const { data: progressPercentage } = useQuery<number>(
    [`progressPercentage-${roadmapMeta.id}`],
    () => getRoadmapProgressOfUser(currentUser?.email, roadmapMeta.id, cookies.user),
  );


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

          <div className="flex flex-row justify-between w-80 border-solid border-2 border-indigo-600">
            <div>
              <p>Progress: {progressPercentage}</p>


              <LinearProgress variant="determinate" value={progressPercentage} />
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
                {generateStarsforExperienceLevel(roadmapMeta.experienceLevel)}
              </p>
              <p className="overflow-ellipsis overflow-hidden whitespace-nowrap pl-1">
                {roadmapMeta.hours} hours
              </p>
            </div>
          </div>
        </Link>
        <div className="flex-shrink-0 min-w-max flex mx-2 cursor-pointer">
          <Delete id={roadmapMeta.id} onClick={handleOpen} />
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded shadow-lg p-4 rounded-5">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete?
            </Typography>
            <div className="flex justify-between">
              <Button onClick={handleClose}>no</Button>
              <Button className="text-red-600	" onClick={handleDeleteClick}>
                yes
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </li>
  );
}

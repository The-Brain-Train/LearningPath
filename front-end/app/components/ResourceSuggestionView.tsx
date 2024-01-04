import { Box, Modal } from "@mui/material";
import { modalStyle } from "../util/modalStyle";
import { ResourceType, NotificationType } from "../util/types";
import {
  addResourcesToRoadmap,
  markNotificationAsProcessed,
} from "../functions/httpRequests";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../util/queryClient";

type ResourceSuggestionViewProps = {
  notification: NotificationType;
  open: boolean;
  onClose: () => void;
  userEmail: string;
  cookieUserToken: string;
};

const ResourceSuggestionView = (props: ResourceSuggestionViewProps) => {

  const parseResourseJson = (notification: NotificationType) => {
    if (notification.body === null) {
      return null;
    }
    const bodyString = notification.body;
    const parsedBody = JSON.parse(bodyString);
    const resourcesArray: ResourceType[] = parsedBody.resources;
    const resource = resourcesArray[0];
    return resource;
  };

  const { mutateAsync: mutateResourceSuggestionConfirm } = useMutation(
    async (): Promise<any> => {
      await addResourcesToRoadmap(
        props.userEmail,
        props.notification.roadmapMetaId,
        JSON.stringify(props.notification.body),
        props.cookieUserToken,
        false
      );
      return markNotificationAsProcessed(
        props.notification.id,
        props.cookieUserToken
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allNotifications"]);
      },
    }
  );

  const handleResourceSuggestionConfirm = () => {
    mutateResourceSuggestionConfirm();
    props.onClose();
  };

  const handleResourceSuggestionReject = () => {
    props.onClose();
  };

  const curNotificationResourse = parseResourseJson(props.notification);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div>
          <p className="mt-2 mb-10 text-center">
            Suggested resource into your roadmap&nbsp;
            <span className="font-bold">
              {props.notification.roadmapName}
            </span>
            .
          </p>
          <div className="border-2 border-dotted border-inherit rounded">
            <p className="text-center italic my-4">
              {curNotificationResourse?.type}
            </p>
            {curNotificationResourse?.link ? (
              <Link
                href={curNotificationResourse?.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-center text-xl mb-4 hover:text-blue-500 hover:font-bold hover:underline">
                  {curNotificationResourse?.name}
                </p>
              </Link>
            ) : (
              <p className="text-center text-xl mb-4">
                {curNotificationResourse?.name}
              </p>
            )}
          </div>
          {!props.notification.isProcessed ? (
            <div className="flex flex-col mt-10">
              <p className="text-center">
                Do you accept this resource suggestion?
              </p>
              <div className="flex flex-row justify-between">
                <button
                  onClick={handleResourceSuggestionConfirm}
                  className="w-2/6 mx-4 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={handleResourceSuggestionReject}
                  className="w-2/6 mx-4 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col mt-10">
              <p className="text-center">
                This resourse is already added into roadmap&nbsp;
                <span className="font-bold">
                  {props.notification.roadmapName}
                </span>.
              </p>
              <div className="flex flex-row justify-center">
                <button
                  onClick={handleResourceSuggestionReject}
                  className="w-2/6 mx-4 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ResourceSuggestionView;
import {
  Box,
  FormLabel,
  FormControl,
  MenuItem,
  Modal,
  TextField
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getUnreadNotificationsOfUser } from "../functions/httpRequests";
import { User } from '../util/types';
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { modalStyle } from "../create/createModalStyle";
import { addResourcesToRoadmap } from "../functions/httpRequests";

type NotificationPaneType = {
  currentUser: User | null | undefined;
  cookieUserToken: string;
  notificationsVisible: boolean;
};

type NotificationType = {
  id: string;
  message: string;
  body: string;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  roadmapMetaId: string | null;
  roadmapName: string | null;
  type: string;
  timestamp: string;
  timeDiffMessage: string;
  isRead: string;
};

const NotificationPane = (props: NotificationPaneType) => {

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [currentNotification, setCurrentNotification] = useState<NotificationType | null>(null);
  const queryClient = useQueryClient();

  const { data: unreadNotifications } = useQuery<NotificationType[]>(
    ["unreadNotifications"],
    () => getUnreadNotificationsOfUser(
      props.currentUser?.email as string,
      props.cookieUserToken),
    {
      enabled: !!props.currentUser,
    }
  );

  const showHideModel = () => {
    const open =
      queryClient.getQueryData<boolean>(["showSuggestResourceNotification"]) || false;
    setOpen(open);
    queryClient.setQueryData(["showSuggestResourceNotification"], false);
    return open;
  };

  const handleNotificationClick = (notification: NotificationType) => {
    setCurrentNotification(notification);
    setOpen(true);
  };

  const handleResourceSuggestionConfirm = () => {
    if (!currentNotification) {
      return;
    }
    addResourcesToRoadmap(
      props.currentUser?.email,
      currentNotification.roadmapMetaId,
      JSON.stringify(currentNotification.body),
      props.cookieUserToken
    );
  };

  const handleResourceSuggestionReject = () => {

  };

  return (
    <>
      <div className="relative">
        {/* <div className="flex flex-row items-center"> */}
        <NotificationsIcon className="my-5" />
        {/* <p className="pl-2">Notifications</p> */}
        {/* </div> */}
        {props.notificationsVisible &&
          <div className="absolute w-80 right-0 bg-white rounded-md shadow-xl z-10 overflow-y-auto max-h-80">
            {unreadNotifications &&
              unreadNotifications.map((n, index) => (
                <li
                  onClick={() => handleNotificationClick(n)}
                  key={index}
                  className="block px-4 py-2 h-18 line-clamp-3 text-left whitespace-normal text-gray-700 hover:bg-gray-500 hover:text-gray-50"
                >
                  <div className="flex flex-row">
                    <div className="items-center pr-2 py-2">
                      <p className="text-base">💡</p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-bold">{n.senderName}</span>
                        {` ${n.message} `}
                        <span className="font-bold">{n.roadmapName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-left pl-7 pt-2 text-xs text-sky-700">
                    <p>
                      {n.timeDiffMessage}
                    </p>
                  </div>
                </li>
              ))
            }
          </div>}
      </div>

      {currentNotification &&
        currentNotification.type === "ROADMAP_RESOURCE_SUGGESTED" &&
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <div>
              <FormLabel>
                {currentNotification.body}
              </FormLabel>
              <div className="flex flex-row justify-between">
              <button
                onClick={handleResourceSuggestionConfirm}
                className="w-2/6 mx-4 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              >
                  Confirm
              </button>
              <button
                onClick={handleResourceSuggestionReject}
                className="w-2/6 mx-4 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
              >
                  Reject
              </button>
              </div>
            </div>
          </Box>
        </Modal>}
    </>
  )
}

export default NotificationPane
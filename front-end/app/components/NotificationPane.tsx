import {
  Box,
  FormLabel,
  FormControl,
  MenuItem,
  Modal,
  TextField
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { User } from '../util/types';
import { MouseEvent, useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { modalStyle } from "../create/createModalStyle";
import {
  addResourcesToRoadmap,
  getUnreadNotificationsOfUser,
  getAllNotificationsOfUser,
  markNotificationAsRead,
  markNotificationAsUnRead
} from "../functions/httpRequests";
import CircleIcon from '@mui/icons-material/Circle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
  const [curNotificationOption, setCurNotificationOption] = useState(-1);
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

  const { data: allNotifications } = useQuery<NotificationType[]>(
    ["allNotifications"],
    () => getAllNotificationsOfUser(
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
    markNotificationAsRead(
      notification.id,
      props.cookieUserToken
    );
    setCurrentNotification(notification);
    setOpen(true);
  };

  const handleNotificationMoreButtonClick = (e: MouseEvent,
    notification: NotificationType, index: number) => {
    e.stopPropagation();
    setCurNotificationOption(index);

  };

  const handleNotificationMoreMouseLeaveClick = (index: number) => {
    setCurNotificationOption(-1);
  };

  const { mutateAsync: mutateNotification } =
    useMutation(
      async ({ notification }: { notification: NotificationType }): Promise<any> => {
        return notification.isRead
          ? markNotificationAsUnRead(notification.id, props.cookieUserToken)
          : markNotificationAsRead(notification.id, props.cookieUserToken);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["allNotifications"]);
        },
      });

  const handleNotificationStatusClick = (e: MouseEvent, notification: NotificationType) => {
    e.stopPropagation();
    mutateNotification({ notification: notification });
    setCurNotificationOption(-1);
  };

  const handleNotificationDeleteClick = (e: MouseEvent, notification: NotificationType) => {
    e.stopPropagation();

    setCurNotificationOption(-1);
  };

  const handleResourceSuggestionConfirm = () => {
    if (!currentNotification) {
      return;
    }
    addResourcesToRoadmap(
      props.currentUser?.email,
      currentNotification.roadmapMetaId,
      JSON.stringify(currentNotification.body),
      props.cookieUserToken,
      false
    );
    handleClose();
  };

  const handleResourceSuggestionReject = () => {
    if (!currentNotification) {
      return;
    }
    handleClose();
  };

  return (
    <>
      <div className="relative" >
        {/* <div className="flex flex-row items-center"> */}
        <NotificationsIcon className="my-5" />
        {/* <p className="pl-2">Notifications</p> */}
        {/* </div> */}
        {props.notificationsVisible &&
          <div onBlur={handleClose} className="absolute w-96 right-0 bg-white rounded-md shadow-xl z-10 overflow-y-auto max-h-80">
            {allNotifications &&
              allNotifications.map((n, index) => (
                <div
                  // onClick={() => handleNotificationClick(n)}
                  key={index}
                  className="block px-4 py-2 h-18 line-clamp-3 text-left whitespace-normal text-gray-700 hover:bg-gray-300"
                >
                  <div className="flex flex-row">
                    <div className="items-center pr-2 py-2">
                      <p className="text-base">💡</p>
                    </div>
                    <div
                      onClick={() => handleNotificationClick(n)}
                    >
                      <p className={`text-sm ${n.isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                        <span className="font-bold">{n.senderName}</span>
                        {` ${n.message} `}
                        <span className="font-bold">{n.roadmapName}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end items-center">
                      <MoreHorizIcon
                        className="relative hover:bg-slate-400 hover:rounded-full"
                        onClick={(e) => handleNotificationMoreButtonClick(e, n, index)}
                      />
                      {curNotificationOption === index &&
                        <div
                          className="absolute w-32 right-0 z-10 bg-white my-6 shadow-md text-wrap mr-5"
                          onMouseLeave={() => handleNotificationMoreMouseLeaveClick(index)}>
                          <ul className="text-sm">
                            <li
                              className="hover:bg-slate-300 p-1"
                              onClick={(e) => handleNotificationStatusClick(e, n)}
                            >
                              {n.isRead ? 'Mark as unread' : 'Mark as read'}
                            </li>
                            <li
                              className="hover:bg-slate-300 p-1"
                              onClick={(e) => handleNotificationDeleteClick(e, n)}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="pl-7 pr-1 pt-2 flex flex-row justify-between">
                    <p className={`text-left text-xs ${n.isRead ? 'text-gray-500' : 'text-sky-700'}`}>
                      {n.timeDiffMessage}
                    </p>
                    {!n.isRead && <CircleIcon color="primary" fontSize="inherit" className="pb-1" />}
                  </div>
                </div>
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
              {/* <FormLabel className="text-white">
                {currentNotification.body}
              </FormLabel> */}
              <span>
                {currentNotification.body}
              </span>
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
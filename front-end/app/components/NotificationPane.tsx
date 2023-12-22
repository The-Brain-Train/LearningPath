import NotificationsIcon from '@mui/icons-material/Notifications';
import { User } from '../util/types';
import { MouseEvent, useEffect, useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllNotificationsOfUser,
  markNotificationAsRead,
  markNotificationAsUnRead,
  deleteNotification
} from "../functions/httpRequests";
import CircleIcon from '@mui/icons-material/Circle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ResourceSuggestionView from "./ResourceSuggestionView";
import { useRouter } from 'next/navigation'

type NotificationPaneType = {
  currentUser: User | null | undefined;
  cookieUserToken: string;
  notificationsVisible: boolean;
  onIconClick: () => void;
};

export type NotificationType = {
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
  isRead: boolean;
  isProcessed: boolean;
};

const NotificationPane = (props: NotificationPaneType) => {

  const [openSuggestedResourseBox, setOpenSuggestedResourseBox] = useState(false);
  const [curNotificationOption, setCurNotificationOption] = useState(-1);
  const [currentNotification, setCurrentNotification] = useState<NotificationType | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const handleCloseSuggestedResourseBox = () => setOpenSuggestedResourseBox(false);
  const queryClient = useQueryClient();
  const router = useRouter()

  const { data: allNotifications, isSuccess: allNotificationsRecieved } =
    useQuery<NotificationType[]>(
      ["allNotifications"],
      () => getAllNotificationsOfUser(
        props.currentUser?.email as string,
        props.cookieUserToken),
      {
        enabled: !!props.currentUser,
      }
    );

  useEffect(() => {
    if (allNotificationsRecieved && allNotifications.length > 0) {
      const count = allNotifications.filter(n => !n.isRead).length;
      setUnreadCount(count);
    } else {
      setUnreadCount(0);
    }
  }, [allNotifications]);

  const { mutateAsync: mutateNotificationClick } =
    useMutation(
      async ({ notification }: { notification: NotificationType }): Promise<any> => {
        return markNotificationAsRead(
          notification.id,
          props.cookieUserToken
        );
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["allNotifications"]);
        },
      });

  const handleNotificationClick = (notification: NotificationType) => {
    mutateNotificationClick({ notification: notification });
    setCurrentNotification(notification);
    switch (notification.type) {
      case "ROADMAP_RESOURCE_SUGGESTED": {
        setOpenSuggestedResourseBox(true);
        break;
      }
      case "ROADMAP_FAVORITED":
      case "ROADMAP_UNFAVORITED":
      case "ROADMAP_UPVOTED":
      case "ROADMAP_DOWNVOTED": {
        router.push(`/explore/${notification.roadmapMetaId}`, { scroll: false });
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleNotificationMoreButtonClick = (e: MouseEvent,
    notification: NotificationType, index: number) => {
    e.stopPropagation();
    setCurNotificationOption(index);
  };

  const handleNotificationMoreMouseLeaveClick = (index: number) => {
    setCurNotificationOption(-1);
  };

  const { mutateAsync: mutateNotificationStatusClick } =
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
    mutateNotificationStatusClick({ notification: notification });
    setCurNotificationOption(-1);
  };

  const { mutateAsync: mutateNotificationDeleteClick } =
    useMutation(
      async ({ notification }: { notification: NotificationType }): Promise<any> => {
        return deleteNotification(notification.id, props.cookieUserToken);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["allNotifications"]);
        },
      });

  const handleNotificationDeleteClick = (e: MouseEvent, notification: NotificationType) => {
    e.stopPropagation();
    mutateNotificationDeleteClick({ notification: notification });
    setCurNotificationOption(-1);
  };

  return (
    <>
      <div className="relative mx-1 md:mx-6" >
        {unreadCount > 0 &&
          <div className="absolute top-8 left-4 bg-red-500 rounded-full w-4 h-4 text-center text-xs font-semibold text-white">
            {unreadCount}
          </div>
        }
        <NotificationsIcon className="my-5 cursor-pointer hover:bg-gray-100" onMouseDown={props.onIconClick} />
        {props.notificationsVisible &&
          <div onBlur={handleCloseSuggestedResourseBox} className="absolute w-72 md:w-96 right-0 bg-white rounded-md shadow-xl z-10 overflow-y-auto max-h-80">
            {allNotifications &&
              allNotifications.map((n, index) => (
                <div
                  key={index}
                  className="block px-4 py-2 md:h-18 line-clamp-3 text-left whitespace-normal text-gray-700 hover:bg-gray-300"
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
      {currentNotification && props.currentUser &&
        <ResourceSuggestionView
          notification={currentNotification}
          open={openSuggestedResourseBox}
          onClose={handleCloseSuggestedResourseBox}
          userEmail={props.currentUser.email as string}
          cookieUserToken={props.cookieUserToken}
        />
      }
    </>
  )
}

export default NotificationPane
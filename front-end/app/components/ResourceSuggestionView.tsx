import {
    Box,
    FormLabel,
    FormControl,
    MenuItem,
    Modal,
    TextField
} from "@mui/material";
import { modalStyle } from "../create/createModalStyle";
import { NotificationType } from "../components/NotificationPane";
import { ResourceType } from "../util/types";
import {
    addResourcesToRoadmap,
    markNotificationAsProcessed
} from "../functions/httpRequests";

type ResourceSuggestionViewProps = {
    notification: NotificationType;
    open: boolean;
    onClose: () => void;
    userEmail: string;
    cookieUserToken: string;
};

const ResourceSuggestionView = (props: ResourceSuggestionViewProps) => {

    const parseResourseJson = (notification: NotificationType) => {
        const bodyString = notification.body;
        const parsedBody = JSON.parse(bodyString);
        const resourcesArray: ResourceType[] = parsedBody.resources;
        const resource = resourcesArray[0];
        return resource;
    };

    const handleResourceSuggestionConfirm = () => {
        addResourcesToRoadmap(
            props.userEmail,
            props.notification.roadmapMetaId,
            JSON.stringify(props.notification.body),
            props.cookieUserToken,
            false
        );
        markNotificationAsProcessed(
            props.notification.id,
            props.cookieUserToken
        );
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
                    <p className="mb-10">
                        Add suggested resource into your roadmap&nbsp;
                        <span className="font-bold">
                            {props.notification.roadmapName}
                        </span>.
                    </p>
                    <div>
                        <p>Name: {curNotificationResourse?.name}</p>
                        <p>Type: {curNotificationResourse?.type}</p>
                        <p>Link: {curNotificationResourse?.link}</p>
                    </div>

                    {!props.notification.isProcessed ? (
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
                        </div>) : (
                        <div>
                            <p>This resourse is already added.</p>
                            <button
                                onClick={handleResourceSuggestionReject}
                                className="w-2/6 mx-4 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                            >
                                OK
                            </button>
                        </div>
                    )}
                </div>
            </Box>
        </Modal>
    )
}

export default ResourceSuggestionView
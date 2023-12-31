import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { FavoriteButton } from "./FavoriteButton";
import { Download as DownloadIcon, Share} from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Roadmap, RoadmapMeta, RoadmapMetaList, User } from "@/app/util/types";
import { useEffect, useState } from "react";
import {
  downloadRoadmapAsJson,
  downloadRoadmapAsSvg,
  findRoadmapMeta,
  shareRoadmap,
} from "../../functions/roadmapMenuFunctions";
import {
  addRoadmapMetaToUserFavorites,
  createCopyOfRoadmapForCurrentUser,
  getRoadmapMeta,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
  postNotification,
} from "@/app/functions/httpRequests";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { PromptMessage } from "@/app/components/PromptMessage";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import {
  roadmapFavoritedMessage,
  roadmapUnfavoritedMessage,
} from "../../util/constants";

type RoadmapMenuProps = {
  currentUser: User | null | undefined;
  roadmap: Roadmap | undefined;
  roadmapMetaId: string;
  roadmapMetaList: RoadmapMetaList | undefined;
};

export const RoadmapMenu = ({
  currentUser,
  roadmap,
  roadmapMetaId,
  roadmapMetaList,
}: RoadmapMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [scrollToResources, setScrollToResources] = useState(false);
  const [cookies] = useCookies(["user"]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor | undefined>('success');
  const [roadmapMeta, setRoadmapMeta] = useState<RoadmapMeta | null>(null);

  const handleDownloadRoadmapAsJson = () => {
    downloadRoadmapAsJson(roadmap);
    setSnackbarMessage("Roadmap downloaded successfully!");
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleCreateRoadmapCopy = async () => {
    await createCopyOfRoadmapForCurrentUser(
      currentUser?.email,
      roadmapMetaId,
      cookies.user
    );
    handleCloseModal();
    setSnackbarMessage("Roadmap copied successfully to My Roadmaps!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScrollToResources = () => {
    setScrollToResources(true);
    const resourcesSection = document.getElementById("resources-section");

    if (resourcesSection) {
      resourcesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadRoadmapAsSvg = () => {
    downloadRoadmapAsSvg();
    setSnackbarMessage("Roadmap downloaded successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const toggleFavorite = async () => {
    const matchingRoadmapMeta = findRoadmapMeta(roadmapMetaId, roadmapMetaList);
    if (!matchingRoadmapMeta) {
      console.error(`RoadmapMeta not found for roadmapId: ${roadmapMetaId}`);
      return;
    }
    if (isRoadmapInFavorites) {
      await removeRoadmapMetaFromUserFavorites(
        currentUser?.email,
        matchingRoadmapMeta,
        cookies.user
      );
      await postNotification(
        roadmapUnfavoritedMessage,
        null,
        currentUser?.email,
        matchingRoadmapMeta?.userEmail,
        matchingRoadmapMeta?.id,
        "ROADMAP_UNFAVORITED",
        cookies.user
      );
    } else {
      await addRoadmapMetaToUserFavorites(
        currentUser?.email,
        matchingRoadmapMeta,
        cookies.user
      );
      await postNotification(
        roadmapFavoritedMessage,
        null,
        currentUser?.email,
        matchingRoadmapMeta?.userEmail,
        matchingRoadmapMeta?.id,
        "ROADMAP_FAVORITED",
        cookies.user
      );
    }
    refetchFavorites();
  };

  const fetchUserFavorites = async () => {
    return await getUserFavorites(
      currentUser ? currentUser?.email : null,
      cookies.user
    );
  };

  const fetchRoadmapMeta = async () => {
    try {
      const fetchedRoadmapMeta = await getRoadmapMeta(roadmapMetaId, cookies.user);
      setRoadmapMeta(fetchedRoadmapMeta);
    } catch (error) {
      console.error('Error fetching roadmapMeta:', error);
    }
  };

  useEffect(() => {
    fetchRoadmapMeta();
  }, [roadmapMetaId]);


  const { data: favorites, refetch: refetchFavorites } = useQuery(
    ["favorites"],
    fetchUserFavorites,
    {
      enabled: !!currentUser,
    }
  );

  const isRoadmapInFavorites = favorites?.some(
    (favorite: RoadmapMeta) => favorite.id === roadmapMetaId
  );

  const handleShare = async () => {
    const roadmapMeta: RoadmapMeta | undefined = findRoadmapMeta(
      roadmapMetaId,
      roadmapMetaList
    );
    shareRoadmap(roadmapMeta?.name);
  };

  return (
    <div>
      {currentUser && (
        <FavoriteButton
          onClick={toggleFavorite}
          isFavorite={isRoadmapInFavorites}
        />
      )}
     {roadmapMeta && roadmapMeta.userEmail !== currentUser?.email && (
        <IconButton
          onClick={handleOpen}
          sx={{ color: "white", textAlign: "center", cursor: "pointer" }}
        >
          <Tooltip title="Create copy">
            <div>
              <ContentCopyIcon />
              <div style={{ fontSize: "7px" }}>Create copy</div>
            </div>
          </Tooltip>
        </IconButton>
      )}
      <PromptMessage
            type="confirmation"
            open={open}
            onClose={handleCloseModal}
            onConfirm={handleCreateRoadmapCopy}
            message="Create A Copy?"
            confirmText="YES"
            cancelText="NO"
          />
      <IconButton
        onClick={handleShare}
        sx={{ color: "white", textAlign: "center", cursor: "pointer" }}
      >
        <Tooltip title="Share">
          <div>
            <Share />
            <div style={{ fontSize: "7px" }}>Share</div>
          </div>
        </Tooltip>
      </IconButton>
      <IconButton
        onClick={handleClick}
        sx={{ color: "white", textAlign: "center", cursor: "pointer" }}
      >
        <Tooltip title="Download">
          <div>
            <DownloadIcon />
            <div style={{ fontSize: "7px" }}>Download</div>
          </div>
        </Tooltip>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDownloadRoadmapAsJson}>As JSON</MenuItem>
        <MenuItem onClick={handleDownloadRoadmapAsSvg}>As SVG</MenuItem>
      </Menu>
      <IconButton
        onClick={handleScrollToResources}
        sx={{ color: "white", textAlign: "center", cursor: "pointer" }}
      >
        <Tooltip title="Resource">
          <div>
            <LibraryBooksIcon />
            <div style={{ fontSize: "7px" }}>Resource</div>
          </div>
        </Tooltip>
      </IconButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

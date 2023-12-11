import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { FavoriteButton } from "./FavoriteButton";
import { Download as DownloadIcon, Share } from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Roadmap, RoadmapMeta, RoadmapMetaList, User } from "@/app/util/types";
import { useState } from "react";
import {
  downloadRoadmapAsJson,
  downloadRoadmapAsSvg,
  findRoadmapMeta,
  shareRoadmap,
} from "./roadmapIdUtils";
import {
  addRoadmapMetaToUserFavorites,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
} from "@/app/functions/httpRequests";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

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

  const handleDownloadRoadmapAsJson = () => {
    downloadRoadmapAsJson(roadmap);
  };

  const handleDownloadRoadmapAsSvg = () => {
    downloadRoadmapAsSvg();
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
    } else {
      await addRoadmapMetaToUserFavorites(
        currentUser?.email,
        matchingRoadmapMeta,
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
    </div>
  );
};

"use client";
import React, { useState } from "react";
import IndentedTreeWithData from "@/app/explore/[roadmapmetaid]/IndentedTreeWithData";
import {
  addRoadmapMetaToUserFavorites,
  getRoadmaps,
  getRoadmapByMetaId,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
  updateUsersCompletedTopic,
  getRoadmapProgressOfUser,
} from "@/app/functions/httpRequests";
import { ArrowBack, Share } from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import useCurrentUserQuery from "@/app/functions/useCurrentUserQuery";
import { useCookies } from "react-cookie";
import {
  Roadmap,
  RoadmapMeta,
  RoadmapMetaList,
  TreeNode,
} from "@/app/util/types";
import { FavoriteButton } from "./FavoriteButton";
import { RoadmapResourcesSection } from "../../components/RoadmapResourcesSection";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";
import { Download as DownloadIcon } from "@mui/icons-material";

type Props = {
  params: {
    roadmapmetaid: string;
  };
};

function RoadMapId(props: Props) {
  const router = useRouter();
  const roadmapMetaId = props.params.roadmapmetaid;
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const downloadRoadmap = () => {
    const roadmapData = JSON.stringify(roadmap, null, 2);
    const blob = new Blob([roadmapData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadRoadmapAsSvg = async () => {
    const roadmapSvgElement = document.getElementById("roadmap-svg");

    if (roadmapSvgElement instanceof SVGElement) {
      const clonedSvgElement = roadmapSvgElement.cloneNode(true) as SVGElement;

      const screenWidth = window.innerWidth;
      const desktopHeight = roadmapSvgElement.scrollHeight;
      const mobileHeight = roadmapSvgElement.scrollHeight * 1.1;

      clonedSvgElement.setAttribute("width", "100%");
      clonedSvgElement.setAttribute("height", "100%");
      if (screenWidth < 768) {
        clonedSvgElement.setAttribute(
          "viewBox",
          `-20 -30 ${screenWidth} ${mobileHeight}`
        );
      } else {
        clonedSvgElement.setAttribute(
          "viewBox",
          `-30 -30 ${screenWidth}  ${desktopHeight}`
        );
      }
      
      const textElements = clonedSvgElement.querySelectorAll("text");
      textElements.forEach((textElement) => {
        textElement.setAttribute("font-weight", "normal");
        textElement.style.fontWeight = "normal";
        textElement.setAttribute("font-size", "14");
        textElement.style.fontSize = "14px";
      });

      const svgData = new XMLSerializer().serializeToString(clonedSvgElement);
      const modifiedSvgData = svgData.replace(/fill="#fff"/g, 'fill="#000"');

      const blob = new Blob([modifiedSvgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "roadmap.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [scrollToResources, setScrollToResources] = useState(false);

  const handleScrollToResources = () => {
    setScrollToResources(true);
    const resourcesSection = document.getElementById("resources-section");

    if (resourcesSection) {
      resourcesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { data: roadmapMetas } = useQuery<RoadmapMetaList>(
    ["roadmapMetas"],
    getRoadmaps
  );

  const { currentUser } = useCurrentUserQuery();

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

  const handleShare = async () => {
    const roadmapMeta: RoadmapMeta | undefined = findRoadmapMeta(roadmapMetaId);
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: `Check out this roadmap on LearningPath: ${roadmapMeta?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      prompt("Copy the following URL:", window.location.href);
    }
  };

  const {
    data: roadmap,
    isLoading,
    isError,
  } = useQuery<Roadmap>(["roadmap", roadmapMetaId], async () => {
    const roadmap = await getRoadmapByMetaId(roadmapMetaId);
    return JSON.parse(roadmap.obj);
  });

  const isRoadmapInFavorites = favorites?.some(
    (favorite: RoadmapMeta) => favorite.id === roadmapMetaId
  );

  const toggleFavorite = async () => {
    const matchingRoadmapMeta = findRoadmapMeta(roadmapMetaId);
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

  const userOwnsRoadmap = () => {
    const roadmapMeta = findRoadmapMeta(roadmapMetaId);
    if (
      currentUser &&
      roadmapMeta &&
      currentUser?.email === roadmapMeta?.userEmail
    ) {
      return true;
    }
    return false;
  };

  const findRoadmapMeta = (roadmapId: string): RoadmapMeta | undefined => {
    if (roadmapMetas == undefined) return;
    return roadmapMetas.roadmapMetaList.find(
      (roadmapMeta: RoadmapMeta) => roadmapMeta.id === roadmapId
    );
  };

  const handleUpdateUsersCompletedTopic = async (completedTask: string) => {
    try {
      if (currentUser?.email && roadmapMetaId) {
        const isCreator = userOwnsRoadmap();
        if (!isCreator) {
          console.error("Permission denied: User is not the creator");
          return;
        }
        const updatedRoadmap: Roadmap | undefined =
          await updateUsersCompletedTopic(
            currentUser.email,
            roadmapMetaId,
            completedTask,
            cookies.user
          );
        queryClient.invalidateQueries(["roadmap", roadmapMetaId]);
        queryClient.invalidateQueries([`progressPercentage-${roadmapMetaId}`]);
        return updatedRoadmap;
      }
    } catch (error) {
      console.error("Error updating completed topic:", error);
    }
  };

  const { data: progressPercentage } = useQuery<number>(
    [`progressPercentage-${roadmapMetaId}`],
    () =>
      getRoadmapProgressOfUser(currentUser?.email, roadmapMetaId, cookies.user),
    {
      enabled: !!currentUser,
    }
  );

  const roadmapToTreeNode = (roadmap: Roadmap | undefined) => {
    return roadmap as unknown as TreeNode;
  };

  const treeNode = roadmapToTreeNode(roadmap);

  if (isError) {
    return (
      <main className="bg-white">
        <div className="w-full flex items-center justify-center h-screen">
          <p className="text-red-500 font-bold">Error fetching roadmap.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="bg-white">
        <div className="w-full flex items-center justify-center h-screen">
          <Box className="flex justify-center items-center flex-col">
            <CircularProgress color="inherit" size={150} />
          </Box>
        </div>
      </main>
    );
  }

  return (
    <main className="main-background">
      <div className="flex flex-col px-3 justify-center items-center">
        <div className="max-w-screen-xl parent-roadmap-container">
          <div className="flex items-center justify-between my-5">
            <div>
              <ArrowBack
                className="text-white cursor-pointer"
                onClick={() => {
                  queryClient.invalidateQueries(["roadmaps"]);
                  router.back();
                }}
              />
            </div>
            {currentUser &&
              userOwnsRoadmap() &&
              (!isSmallScreen ? (
                <div className="w-1/2 items-center justify-center mx-4">
                  <p className="text-white pb-2">
                    Progress: {progressPercentage}%
                  </p>
                  <LinearProgress
                    variant="determinate"
                    value={
                      progressPercentage !== undefined ? progressPercentage : 0
                    }
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="items-center justify-center mx-6">
                  <CircularProgressWithLabel
                    value={
                      progressPercentage !== undefined ? progressPercentage : 0
                    }
                    size={50}
                  />
                </div>
              ))}
            <div>
              {currentUser && (
                <FavoriteButton
                  onClick={toggleFavorite}
                  isFavorite={isRoadmapInFavorites}
                />
              )}
              <IconButton
                onClick={handleShare}
                sx={{color: "white", textAlign: "center", cursor: "pointer"}}
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
                sx={{color: "white", textAlign: "center", cursor: "pointer"}}
              >
                <Tooltip title="Download">
                  <div>
                    <DownloadIcon />
                    <div style={{ fontSize: "7px" }}>Download</div>
                  </div>
                </Tooltip>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={downloadRoadmap}>As JSON</MenuItem>
                <MenuItem onClick={downloadRoadmapAsSvg}>As SVG</MenuItem>
              </Menu>

              <IconButton
                onClick={handleScrollToResources}
                sx={{color: "white", textAlign: "center", cursor: "pointer"}}
              >
                <Tooltip title="Resource">
                  <div>
                    <LibraryBooksIcon />
                    <div style={{ fontSize: "7px" }}>Resource</div>
                  </div>
                </Tooltip>
              </IconButton>
            </div>
          </div>
          <IndentedTreeWithData
            data={roadmapToTreeNode(roadmap)}
            updateCompletedTopic={handleUpdateUsersCompletedTopic}
            isCreator={userOwnsRoadmap()}
          />
          <div id="resources-section">
            <RoadmapResourcesSection
              treeNode={treeNode}
              userOwnsRoadmap={userOwnsRoadmap()}
              queriesToInvalidate={["roadmap"]}
              roadmapId={roadmapMetaId}
              userEmail={currentUser?.email}
              cookiesUser={cookies.user}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default RoadMapId;

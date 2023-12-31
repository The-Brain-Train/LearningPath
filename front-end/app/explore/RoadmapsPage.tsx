import { RoadmapMeta, User } from "../util/types";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import {
  addRoadmapMetaToUserFavorites,
  upVoteRoadmap,
  downVoteRoadmap,
  removeRoadmapMetaFromUserFavorites,
  postNotification,
} from "../functions/httpRequests";
import {
  roadmapFavoritedMessage,
  roadmapUnfavoritedMessage,
  roadmapUpVotedMessage,
  roadmapDownVotedMessage,
} from "../util/constants";

type RoadmapsPageProps = {
  paginatedRoadmaps: RoadmapMeta[];
  currentUser: User | null | undefined;
  upVotesDownVotes: any;
  favorites: any;
};

export const RoadmapsPage = (props: RoadmapsPageProps) => {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);

  const { mutateAsync: handleUpVotes } = useMutation(
    async (
      { roadmapMetaId, roadmapOwnerEmail, upVoteCount }:
        { roadmapMetaId: string, roadmapOwnerEmail: string, upVoteCount: number }
    ) => {
      const newUpVoteCountText = await upVoteRoadmap(
        props.currentUser?.email,
        roadmapMetaId,
        cookies.user
      );
      const newUpVoteCount = Number(newUpVoteCountText);
      const upVoteDiff = newUpVoteCount - upVoteCount;
      if (props.currentUser?.email !== roadmapOwnerEmail && upVoteDiff > 0) {
        await postNotification(
          roadmapUpVotedMessage,
          null,
          props.currentUser?.email,
          roadmapOwnerEmail,
          roadmapMetaId,
          "ROADMAP_UPVOTED",
          cookies.user
        );
      };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["upVotesDownVotes"]);
        queryClient.invalidateQueries(["roadmaps"]);
      },
    });

  const { mutateAsync: handleDownVotes } = useMutation(
    async (
      { roadmapMetaId, roadmapOwnerEmail, downVoteCount }:
        { roadmapMetaId: string, roadmapOwnerEmail: string, downVoteCount: number }
    ) => {
      const newDownVoteCountText = await downVoteRoadmap(
        props.currentUser?.email,
        roadmapMetaId,
        cookies.user
      );
      const newDownVoteCount = Number(newDownVoteCountText);
      const downVoteDiff = newDownVoteCount - downVoteCount;
      if (props.currentUser?.email !== roadmapOwnerEmail && downVoteDiff > 0) {
        await postNotification(
          roadmapDownVotedMessage,
          null,
          props.currentUser?.email,
          roadmapOwnerEmail,
          roadmapMetaId,
          "ROADMAP_DOWNVOTED",
          cookies.user
        );
      };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["upVotesDownVotes"]);
        queryClient.invalidateQueries(["roadmaps"]);
      },
    });

  const { mutateAsync: handleRemoveFromFavorites } = useMutation({
    mutationFn: async (roadmapMeta: RoadmapMeta) => {
      await removeRoadmapMetaFromUserFavorites(
        props.currentUser?.email,
        roadmapMeta,
        cookies.user
      );
      if (props.currentUser?.email !== roadmapMeta?.userEmail) {
        await postNotification(
          roadmapUnfavoritedMessage,
          null,
          props.currentUser?.email,
          roadmapMeta?.userEmail,
          roadmapMeta?.id,
          "ROADMAP_UNFAVORITED",
          cookies.user
        );
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });

  const { mutateAsync: handleAddToFavorites } = useMutation({
    mutationFn: async (roadmapMeta: RoadmapMeta) => {
      await addRoadmapMetaToUserFavorites(
        props.currentUser?.email,
        roadmapMeta,
        cookies.user
      );
      if (props.currentUser?.email !== roadmapMeta?.userEmail) {
        await postNotification(
          roadmapFavoritedMessage,
          null,
          props.currentUser?.email,
          roadmapMeta?.userEmail,
          roadmapMeta?.id,
          "ROADMAP_FAVORITED",
          cookies.user
        );
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });

  return (
    <ul
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 font-semibold mb-5 mx-10"
      style={{ fontFamily: "Poppins" }}
    >
      {props.paginatedRoadmaps.map((roadmap: RoadmapMeta) => (
        <li
          key={roadmap.id}
          className="rounded-lg shadow-md text-white w-[320px]"
          style={{ backgroundColor: "#141832" }}
        >
          <Link href={`/explore/${roadmap.id}`}>
            <div className="flex justify-between flex-col my-4 mx-4">
              <div className="flex justify-between flex-row">
                <p
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap text-xl capitalize"
                  style={{ maxWidth: "200px" }}
                >
                  {roadmap.name}
                </p>
                <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  <Tooltip title={roadmap.experienceLevel} arrow>
                    <span>
                      {" "}
                      {generateStarsforExperienceLevel(
                        roadmap.experienceLevel
                      )}{" "}
                    </span>
                  </Tooltip>
                </p>
              </div>
              <div className="mt-2">
                <p className="text-right text-sm font-thin">
                  {" "}
                  {roadmap.hours} hours{" "}
                </p>
              </div>
            </div>
          </Link>
          <div className="rounded-b-lg" style={{ backgroundColor: "#42465a" }}>
            <div
              className="flex justify-between flex-row items-center"
              id="icons"
            >
              <div className="flex justify-between flex-row p-1 w-31">
                <div className="flex flex-row items-center">
                  {props.currentUser &&
                    props.upVotesDownVotes &&
                    props.upVotesDownVotes.upVotes ? (
                    <span
                      className="cursor-pointer ml-2"
                      onClick={() => handleUpVotes(
                        {
                          roadmapMetaId: roadmap.id,
                          roadmapOwnerEmail: roadmap.userEmail,
                          upVoteCount: roadmap.upVotes
                        }
                      )}
                    >
                      {props.upVotesDownVotes.upVotes.some(
                        (upVoteRoadmapId: string) =>
                          upVoteRoadmapId === roadmap.id
                      ) ? (
                        <ThumbUpAltIcon />
                      ) : (
                        <ThumbUpOffAltIcon />
                      )}
                    </span>
                  ) : (
                    <span className="ml-2">
                      <ThumbUpAltIcon />
                    </span>
                  )}
                  {roadmap.upVotes < 1000 ? (
                    <span className="text-xs ml-2 mr-4 w-5 text-left">
                      {roadmap.upVotes}
                    </span>
                  ) : (
                    <span className="text-xs ml-2 mr-4 w-5 text-left">
                      {(roadmap.upVotes / 1000).toFixed(1)}K
                    </span>
                  )}
                </div>
                {props.currentUser &&
                  props.upVotesDownVotes &&
                  props.upVotesDownVotes.downVotes ? (
                  <span
                    className="cursor-pointer mr-2"
                    onClick={() => handleDownVotes(
                      {
                        roadmapMetaId: roadmap.id,
                        roadmapOwnerEmail: roadmap.userEmail,
                        downVoteCount: roadmap.downVotes
                      }
                    )}
                  >
                    {props.upVotesDownVotes.downVotes.some(
                      (downVoteRoadmapId: string) =>
                        downVoteRoadmapId === roadmap.id
                    ) ? (
                      <ThumbDownAltIcon />
                    ) : (
                      <ThumbDownOffAltIcon />
                    )}
                  </span>
                ) : (
                  <ThumbDownAltIcon />
                )}
                {roadmap.downVotes < 1000 ? (
                  <span className="text-xs ml-2 mr-4 w-5 text-left mt-1">
                    {roadmap.downVotes}
                  </span>
                ) : (
                  <span className="text-xs ml-2 mr-4 w-5 text-left mt-1">
                    {(roadmap.downVotes / 1000).toFixed(1)}K
                  </span>
                )}
              </div>
              {props.currentUser && props.favorites ? (
                <span
                  className="cursor-pointer mr-2"
                  onClick={() =>
                    props.favorites.some(
                      (favorite: any) => favorite.id === roadmap.id
                    )
                      ? handleRemoveFromFavorites(roadmap)
                      : handleAddToFavorites(roadmap)
                  }
                >
                  {props.favorites.some(
                    (favorite: any) => favorite.id === roadmap.id
                  ) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </span>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

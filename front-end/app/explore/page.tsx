"use client";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  addRoadmapMetaToUserFavorites,
  upVoteRoadmap,
  downVoteRoadmap,
  getRoadmaps,
  getRoadmapsPaged,
  getUserFavorites,
  getUserUpVotesDownVotes,
  removeRoadmapMetaFromUserFavorites,
} from "../functions/httpRequests";
import { RoadmapMeta, User } from "../util/types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, CircularProgress } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReactPaginate from "react-paginate";
import styles from '../explore/explore.module.css'

export default function Explore() {
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapMeta[]>([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
  const [hoursFromFilter, setHoursFromFilter] = useState<number | null>(0);
  const [hoursToFilter, setHoursToFilter] = useState<number | null>(500);
  const [showFilters, setShowFilters] = useState(false);
  //const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const [pageCount, setPageCount] = useState(0);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [hourValidationMessage, setHourValidationMessage] = useState<
    string | null
  >(null);

  const { data: currentUser, isLoading } = useQuery<User | null>(
    ["currentUser"],
    async () => {
      if (cookies.user) {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      }
      return null;
    }
  );

  useEffect(() => {
    console.log(currentUser);
  })

  const fetchUserFavorites = async () => {
    return await getUserFavorites(
      currentUser ? currentUser?.email : null,
      cookies.user
    );
  };

  const fetchUserUpVotesDownVotes = async () => {
    return await getUserUpVotesDownVotes(
      currentUser ? currentUser?.email : null,
      cookies.user
    );
  };

  const { data: roadmaps } = useQuery(["roadmaps"], () => {
        const page: number = queryClient.getQueryData(["thisPage"]) ? 
                        queryClient.getQueryData<number>(["thisPage"]) || 0 : 0;
         console.log("this page::" + page);
          return getRoadmapsPaged(page, itemsPerPage);
        });

  useEffect(() => {
    if(roadmaps) {
      setPageCount(roadmaps.totalPages);
    }
  }, [ roadmaps]);

  const { data: favorites } = useQuery(["favorites"],
    fetchUserFavorites, {
    enabled: !!currentUser,
  });

  const { data: upVotesDownVotes } = useQuery(["upVotesDownVotes"],
    fetchUserUpVotesDownVotes, {
    enabled: !!currentUser,
  });

  const { mutateAsync: handleRemoveFromFavorites } = useMutation({
    mutationFn: async (roadmapMeta: RoadmapMeta) => {
      await removeRoadmapMetaFromUserFavorites(
        currentUser?.email,
        roadmapMeta,
        cookies.user
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });

  const { mutateAsync: handleAddToFavorites } = useMutation({
    mutationFn: async (roadmapMeta: RoadmapMeta) => {
      await addRoadmapMetaToUserFavorites(
        currentUser?.email,
        roadmapMeta,
        cookies.user
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });


  const { mutateAsync: handleUpVotes } = useMutation({
    mutationFn: async (roadmapMetaId: string) => {
      await upVoteRoadmap(
        currentUser?.email,
        roadmapMetaId,
        cookies.user
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["upVotesDownVotes"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const { mutateAsync: handleDownVotes } = useMutation({
    mutationFn: async (roadmapMetaId: string) => {
      await downVoteRoadmap(
        currentUser?.email,
        roadmapMetaId,
        cookies.user
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["upVotesDownVotes"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filterRoadmaps = (roadmap: RoadmapMeta) => {
    if (experienceFilter && roadmap.experienceLevel !== experienceFilter) {
      return false;
    }
    if (hoursFromFilter !== null && roadmap.hours <= hoursFromFilter) {
      return false;
    }
    if (hoursToFilter !== null && roadmap.hours >= hoursToFilter) {
      return false;
    }
    return true;
  };

  const validateHours = (from: number | null, to: number | null): boolean => {
    if (from === null || to === null) {
      setHourValidationMessage(null);
      return true;
    }
    if (to <= from) {
      setHourValidationMessage("To should be greater than From");
      setTimeout(() => setHourValidationMessage(null), 1500);
      return false;
    }
    setHourValidationMessage(null);
    return true;
  };

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchText = event.currentTarget.value;
    setSearch(searchText);
  };

  const handlePageChange = (selectedPage: any) => {
    console.log("selected > "+selectedPage.selected)
    //setCurrentPage(selectedPage.selected);
    
    queryClient.setQueryData(["thisPage"], selectedPage.selected);
    queryClient.invalidateQueries(["roadmaps"]);
  };

  // useEffect(() => {
  //   console.log("ineffect > "+currentPage)
  //  // queryClient.invalidateQueries(["roadmaps"]);
  // },[currentPage])

  // const paginatedRoadmaps = filteredRoadmaps.slice(
  //   currentPage * itemsPerPage,
  //   (currentPage + 1) * itemsPerPage
  // );

  const paginatedRoadmaps = filteredRoadmaps.slice(0, itemsPerPage);

  useEffect(() => {
    const filtered = roadmaps?.content.filter(
      (roadmap: RoadmapMeta) =>
        roadmap.name.toLowerCase().includes(search.toLowerCase()) &&
        filterRoadmaps(roadmap)
    );
    if (filtered) {
      setFilteredRoadmaps(filtered);
    }
  }, [search, roadmaps, experienceFilter, hoursFromFilter, hoursToFilter]);

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
    <main className="main-background min-h-max flex items-center flex-col">
      <div className="flex flex-row my-5 mx-auto gap-x-10">
        <Paper
          component="div"
          className="py-2 px-4 flex w-15 max-h-12 justify-center items-center mt-5 w-64"
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            value={search}
            onChange={handleSearchChange}
          />
          <IconButton type="button" className="p-3" aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {isSmallScreen ? (
          <Button onClick={toggleFilters}>
            <Tooltip title="Filter">
              <TuneIcon className="text-white" />
            </Tooltip>
          </Button>
        ) : (
          <div className="max-w-lg my-5 mx-auto flex flex-row gap-x-10">
            <select
              value={experienceFilter || ""}
              onChange={(e) => setExperienceFilter(e.target.value || null)}
              className="rounded-md h-7 w-full sm:h-12 px-4"
            >
              <option value="">Experience Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <div className="flex flex-col">
              <div className="flex flex-row gap-x-2.5 items-center">
                <span className="text-white">Hours:</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="10"
                  value={hoursFromFilter === null ? "" : hoursFromFilter}
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? null : parseInt(e.target.value);
                    validateHours(newValue, hoursToFilter) &&
                      setHoursFromFilter(newValue);
                  }}
                  placeholder="From"
                  className="rounded-md h-11 w-20 text-center"
                />
                <p className="text-white font-semibold flex justify-center items-center">-</p>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="10"
                  value={hoursToFilter === null ? "" : hoursToFilter}
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? null : parseInt(e.target.value);
                    validateHours(hoursFromFilter, newValue) &&
                      setHoursToFilter(newValue);
                  }}
                  placeholder="To"
                  className="rounded-md h-11 w-20 text-center"
                />
              </div>
              <span className="text-red-500 w-full text-right">{hourValidationMessage}</span>
            </div>
          </div>
        )}
      </div>
      {showFilters && (
        <div className="w-60 max-w-xs mx-auto sm:hidden mt-5 mb-10">
          <select
            value={experienceFilter || ""}
            onChange={(e) => setExperienceFilter(e.target.value || null)}
            className="rounded-md h-7 w-full"
          >
            <option value="">Experience Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <div className="flex flex-row justify-between mt-4">
            <span className="text-white">Hours:</span>
            <input
              type="number"
              min="0"
              max="500"
              step="10"
              value={hoursFromFilter === null ? "" : hoursFromFilter}
              onChange={(e) => {
                const newValue =
                  e.target.value === "" ? null : parseInt(e.target.value);
                validateHours(newValue, hoursToFilter) &&
                  setHoursFromFilter(newValue);
              }}
              placeholder="From"
              className="rounded-md h-7 w-45 mx-2.5 text-center"
            />
            <p className="text-white font-semibold flex justify-center items-center">-</p>
            <input
              type="number"
              min="0"
              max="500"
              step="10"
              value={hoursToFilter === null ? "" : hoursToFilter}
              onChange={(e) => {
                const newValue =
                  e.target.value === "" ? null : parseInt(e.target.value);
                validateHours(hoursFromFilter, newValue) &&
                  setHoursToFilter(newValue);
              }}
              placeholder="To"
              className="rounded-md h-7 w-45 ml-2.5 text-center"
            />
          </div>
          <div className="text-red-500 w-full text-center">{hourValidationMessage}</div>
        </div>
      )}

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}

        containerClassName={styles['pagination']}
        previousLinkClassName={styles['pagination__link']}
        nextLinkClassName={styles['pagination__link']}
        disabledClassName={styles['pagination__link--disabled']}
        activeClassName={styles['pagination__link--active']}

      // containerClassName={'flex justify-between items-center'}
      // previousLinkClassName={'bg-fuchsia-50 m-8 px-4 py-2 rounded border border-blue-500 text-blue-500 cursor-pointer'}
      // nextLinkClassName={'bg-fuchsia-50 m-8 px-4 py-2 rounded border border-blue-500 text-blue-500 cursor-pointer'}
      // disabledClassName={'bg-fuchsia-50 m-8 text-gray-300 border border-gray-300 cursor-not-allowed'}
      // activeClassName={'bg-fuchsia-50 m-8 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'}

      // containerClassName={'mb-8 flex justify-between items-center'}
      // previousLinkClassName={'m-1 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'}
      // nextLinkClassName={'m-1 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'}
      // disabledClassName={'m-1 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'}
      // activeClassName={'m-1 text-red '}
      />

      <ul
        className="grid lg:grid-cols-3 gap-4 lg:gap-10 font-semibold mb-5 mx-10"
        style={{ fontFamily: "Poppins" }}
      >
        {paginatedRoadmaps.map((roadmap: RoadmapMeta) => (
          <li key={roadmap.id}
            className="rounded-lg shadow-md text-white w-[320px]"
            style={{ backgroundColor: "#141832" }}>
            <Link href={`/explore/${roadmap.id}`}>
              <div className="flex justify-between flex-col my-4 mx-4">
                <div className="flex justify-between flex-row">
                  <p className="overflow-ellipsis overflow-hidden whitespace-nowrap text-xl"
                    style={{ textTransform: "capitalize" }} >
                    {roadmap.name}
                  </p>
                  <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                    <Tooltip title={roadmap.experienceLevel} arrow>
                      <span> {generateStarsforExperienceLevel(roadmap.experienceLevel)} </span>
                    </Tooltip>
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-right text-sm font-thin"> {roadmap.hours} hours </p>
                </div>
              </div>
            </Link>

            <div className="rounded-b-lg"
              style={{ backgroundColor: "#42465a" }}>
              <div className="flex justify-between flex-row items-center" id="icons">
                <div className="flex justify-between flex-row p-1 w-31">
                  <div className="flex flex-row items-center">
                    {currentUser && upVotesDownVotes && upVotesDownVotes.upVotes ? (
                      <span className="cursor-pointer ml-2"
                        onClick={() => handleUpVotes(roadmap.id)}
                      >
                        {upVotesDownVotes.upVotes.some(
                          (upVoteRoadmapId: string) => upVoteRoadmapId === roadmap.id
                        ) ? (<ThumbUpAltIcon />) : (<ThumbUpOffAltIcon />)}
                      </span>
                    ) : null}
                    {roadmap.upVotes < 1000 ?
                      (<span className="text-xs ml-2 mr-4 w-5 text-left">
                        {roadmap.upVotes}</span>) :
                      (<span className="text-xs ml-2 mr-4 w-5 text-left">
                        {(roadmap.upVotes / 1000).toFixed(1)}K</span>)}
                  </div>
                  {currentUser && upVotesDownVotes && upVotesDownVotes.downVotes ? (
                    <span className="cursor-pointer mr-2"
                      onClick={() => handleDownVotes(roadmap.id)}
                    >
                      {upVotesDownVotes.downVotes.some(
                        (downVoteRoadmapId: string) => downVoteRoadmapId === roadmap.id
                      ) ? (<ThumbDownAltIcon />) : (<ThumbDownOffAltIcon />)}
                    </span>
                  ) : null}
                </div>

                {currentUser && favorites ? (
                  <span
                    className="cursor-pointer mr-2"
                    onClick={() =>
                      favorites.some(
                        (favorite: any) => favorite.id === roadmap.id
                      ) ? handleRemoveFromFavorites(roadmap) : handleAddToFavorites(roadmap)
                    }
                  >
                    {favorites.some(
                      (favorite: any) => favorite.id === roadmap.id
                    ) ? (<FavoriteIcon />) : (<FavoriteBorderIcon />)}
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main >
  );
}

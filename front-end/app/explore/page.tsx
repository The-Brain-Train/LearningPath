"use client";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, useEffect, useState } from "react";
import {
  getRoadmapsFilteredPaged,
  getUserFavorites,
  getUserUpVotesDownVotes,
} from "../functions/httpRequests";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, CircularProgress } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReactPaginate from "react-paginate";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useCurrentUserQuery from "../functions/useCurrentUserQuery";
import { RoadmapsPage } from "./RoadmapsPage";
import FilterShow from "./FilterShow";
import { FilterProvider } from "./FilterProvider";
import DesktopFilter from "./DesktopFilter";

export default function Explore() {
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;
  const [pageCount, setPageCount] = useState(0);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const { currentUser, isLoading } = useCurrentUserQuery();

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
    let page: number = queryClient.getQueryData(["thisPage"])
      ? queryClient.getQueryData<number>(["thisPage"]) || 0
      : 0;
    const experienceLevel =
      queryClient.getQueryData<string>(["experienceLevel"]) || "";
    const searchText = queryClient.getQueryData<string>(["searchText"]) || "";
    const hoursFromFilter =
      queryClient.getQueryData<number>(["hoursFromFilter"]) || 0;
    const hoursToFilter =
      queryClient.getQueryData<number>(["hoursToFilter"]) || 500;

    if (
      experienceLevel.length > 0 ||
      searchText.length > 0 ||
      hoursFromFilter !== 0 ||
      hoursToFilter !== 500
    ) {
      page = 0;
    }
    return getRoadmapsFilteredPaged(
      searchText,
      experienceLevel,
      hoursFromFilter,
      hoursToFilter,
      page,
      itemsPerPage
    );
  });

  useEffect(() => {
    if (roadmaps) {
      setPageCount(roadmaps.totalPages);
    }
  }, [roadmaps]);

  const { data: favorites } = useQuery(["favorites"], fetchUserFavorites, {
    enabled: !!currentUser,
  });

  const { data: upVotesDownVotes } = useQuery(
    ["upVotesDownVotes"],
    fetchUserUpVotesDownVotes,
    {
      enabled: !!currentUser,
    }
  );

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchText = event.currentTarget.value;
    queryClient.setQueryData(["searchText"], searchText);
    queryClient.invalidateQueries(["roadmaps"]);
  };

  const handlePageChange = (selectedPage: any) => {
    queryClient.setQueryData(["thisPage"], selectedPage.selected);
    queryClient.invalidateQueries(["roadmaps"]);
  };

  const paginatedRoadmaps =
    roadmaps !== undefined ? roadmaps.content : [].slice(0, itemsPerPage);

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
    <FilterProvider>
      <main className="main-background min-h-max flex items-center flex-col">
        <div className="flex flex-row my-5 mx-auto md:gap-x-10">
          <Paper
            component="div"
            className="py-2 px-4 flex w-15 max-h-12 justify-center items-center md:mt-5 w-64"
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
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
            <DesktopFilter />
          )}
        </div>
        {showFilters && <FilterShow />}
        <ReactPaginate
          previousLabel={<ArrowBackIcon />}
          nextLabel={<ArrowForwardIcon />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
        <RoadmapsPage
          paginatedRoadmaps={paginatedRoadmaps}
          currentUser={currentUser}
          upVotesDownVotes={upVotesDownVotes}
          favorites={favorites}
        />
      </main>
    </FilterProvider>
  );
}

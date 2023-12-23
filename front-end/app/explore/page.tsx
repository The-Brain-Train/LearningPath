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
import { Box, CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import ReactPaginate from "react-paginate";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useCurrentUserQuery from "../functions/useCurrentUserQuery";
import { RoadmapsPage } from "./RoadmapsPage";
import { FilterProvider } from "./FilterProvider";
import ExploreFilters from "./ExploreFilters";

export default function Explore() {
  const itemsPerPage = 9;
  const [pageCount, setPageCount] = useState(0);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);
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

    const prevExperienceLevel =
      queryClient.getQueryData<string>(["prevExperienceLevel"]) || "";
    const prevSearchText =
      queryClient.getQueryData<string>(["prevSearchText"]) || "";
    const prevHoursFromFilter =
      queryClient.getQueryData<number>(["prevHoursFromFilter"]) || 0;
    const prevHoursToFilter =
      queryClient.getQueryData<number>(["prevHoursToFilter"]) || 500;

    if (
      experienceLevel.length !== prevExperienceLevel.length ||
      searchText.length !== prevSearchText.length ||
      hoursFromFilter !== prevHoursFromFilter ||
      hoursToFilter !== prevHoursToFilter
    ) {
      page = 0;
      queryClient.setQueryData(["thisPage"], 0);
    }

    const result = getRoadmapsFilteredPaged(
      searchText || "",
      experienceLevel || "",
      hoursFromFilter || 0,
      hoursToFilter || 500,
      page,
      itemsPerPage
    );

    queryClient.setQueryData<string>(["prevExperienceLevel"], experienceLevel);
    queryClient.setQueryData<string>(["prevSearchText"], searchText);
    queryClient.setQueryData<number>(["prevHoursFromFilter"], hoursFromFilter);
    queryClient.setQueryData<number>(["prevHoursToFilter"], hoursToFilter);

    return result;
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
        <h1 className="text-white text-4xl md:text-5xl mt-5 mb-3 max-w-sm md:max-w-lg font-bold  text-center mx-3">Explore our Community Roadmaps</h1>
        <div className="flex flex-col md:flex-row md:mt-5 mb-5 md:mb-12 md:items-center gap-3 md:gap-5 w-72 md:w-[780px]">
          <Paper
            component="div"
            className="py-2 px-4 flex w-15 max-h-12 mt-6 md:w-80"
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
          <ExploreFilters />
        </div>
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
          forcePage={queryClient.getQueryData<number>(["thisPage"]) || 0}
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

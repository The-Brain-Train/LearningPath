"use client";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  addRoadmapMetaToUserFavorites,
  getRoadmaps,
  getUserFavorites,
  removeRoadmapMetaFromUserFavorites,
} from "../functions/httpRequests";
import { RoadmapMeta, User } from "../util/types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, CircularProgress } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Explore() {
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapMeta[]>([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
  const [hoursFromFilter, setHoursFromFilter] = useState<number | null>(0);
  const [hoursToFilter, setHoursToFilter] = useState<number | null>(500);
  const [showFilters, setShowFilters] = useState(false);
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

  const fetchUserFavorites = async () => {
    return await getUserFavorites(
      currentUser ? currentUser?.email : null,
      cookies.user
    );
  };

  const { data: roadmaps } = useQuery(["roadmaps"], getRoadmaps);
  const { data: favorites } = useQuery(["favorites"], fetchUserFavorites, {
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
      setTimeout(() => setHourValidationMessage(null), 2500);
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

  useEffect(() => {
    const filtered = roadmaps?.roadmapMetaList.filter(
      (roadmap) =>
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
              className="rounded-md h-7 w-full sm:h-12"
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
        <div className="max-w-xs my-5 mx-auto sm:hidden">
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
          <span className="text-white">Hours:</span>
          <div className="flex flex-row gap-2 justify-between">
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
              className="rounded px-1"
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
              className="rounded px-1"
            />
          </div>
          <div className="flex w-52 mt-2.5 text-white">{hourValidationMessage}</div>
        </div>
      )}
      <ul
        className="grid lg:grid-cols-3 gap-4 lg:gap-10 font-semibold"
        style={{ fontFamily: "Poppins" }}
      >
        {filteredRoadmaps.map((roadmap: RoadmapMeta) => (
          <li
            key={roadmap.id}
            className="rounded-lg shadow-md text-white w-[320px] bg-blue-900"
            style={{ backgroundColor: "#141832" }}
          >
            <div className="flex items-center py-4 lg:py-8 flex-row max-w-xs px-6">
              <Link
                className="text-left overflow-hidden flex justify-between flex-1 flex-col gap-4"
                href={`/explore/${roadmap.id}`}
              >
                <p
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap text-xl"
                  style={{ textTransform: "capitalize" }}
                >
                  {roadmap.name}
                </p>
                <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  <Tooltip title={roadmap.experienceLevel} arrow>
                    <span>
                      {generateStarsforExperienceLevel(roadmap.experienceLevel)}
                    </span>
                  </Tooltip>
                </p>
              </Link>
              <div className="flex justify-between flex-1 flex-col gap-4 text-right">
                {currentUser && favorites ? (
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      favorites.some(
                        (favorite: any) => favorite.id === roadmap.id
                      )
                        ? handleRemoveFromFavorites(roadmap)
                        : handleAddToFavorites(roadmap)
                    }
                  >
                    {favorites.some(
                      (favorite: any) => favorite.id === roadmap.id
                    ) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </span>
                ) : null}
                <p className="overflow-ellipsis overflow-hidden whitespace-nowrap flex justify-end">
                  {roadmap.hours} hours
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

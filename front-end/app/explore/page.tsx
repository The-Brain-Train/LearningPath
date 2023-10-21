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
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwtDecode from 'jwt-decode';
import { useCookies } from 'react-cookie';
import styles from '../explore/explore.module.css'

export default function Explore() {
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapMeta[]>([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
  const [hoursFromFilter, setHoursFromFilter] = useState<number | null>(0);
  const [hoursToFilter, setHoursToFilter] = useState<number | null>(500);
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["user"]);
  const [hourValidationMessage, setHourValidationMessage] = useState<string | null>(null);

  const { data: currentUser } = useQuery<User | null>(
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
  }

  const { data: roadmaps } = useQuery(["roadmaps"], getRoadmaps);
  const { data: favorites } = useQuery(
    ["favorites"],
    fetchUserFavorites,
    {
      enabled: !!currentUser
    }
  );

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
    }
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
    }
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
      return false;
    }
    setHourValidationMessage(null);
    return true;
  }

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

  return (
    <main className="main-background min-h-max flex items-center flex-col">

      <div className={styles['filter-options-mobile-1']} style={{ maxWidth: "300px" }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 250,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            value={search}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Button onClick={toggleFilters}>
          <Tooltip title="Filter">
            <TuneIcon className="text-white" />
          </Tooltip>
        </Button>
      </div>

      <div className={styles['filter-options-desktop']}>

        <div className="flex flex-row mb-5" style={{ maxWidth: "300px" }}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 600,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              value={search}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>

        <select
          value={experienceFilter || ""}
          onChange={(e) => setExperienceFilter(e.target.value || null)}
          className="rounded-md h-11"
          style={{ width: "200px" }}
        >
          <option value="">Experience Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        <div className={styles['hours-desktop']}>
          <div className={styles['hours-div-desktop']}>
            <span className="text-white">Hours:</span>
            <input
              type="number"
              min="0"
              max="500"
              step="10"
              value={hoursFromFilter === null ? "" : hoursFromFilter}
              onChange={(e) => {
                const newValue = e.target.value === "" ? null : parseInt(e.target.value);
                validateHours(newValue, hoursToFilter) &&
                  setHoursFromFilter(newValue)
              }}
              placeholder="From"
              className={styles['hour-input-desktop']}
            />
            <input
              type="number"
              min="0"
              max="500"
              step="10"
              value={hoursToFilter === null ? "" : hoursToFilter}
              onChange={(e) => {
                const newValue = e.target.value === "" ? null : parseInt(e.target.value);
                validateHours(hoursFromFilter, newValue) &&
                  setHoursToFilter(newValue)
              }}
              placeholder="To"
              className={styles['hour-input-desktop']}
            />
          </div>
          <span className={styles['hour-validation']}>{hourValidationMessage}</span>
        </div>

      </div>

      <div style={{ maxWidth: "300px", width: "80%" }}>
        {showFilters && (
          <div
            className={styles['filter-options-mobile-2']}
            style={{ maxWidth: "200px", margin: "0 auto" }}
          >
            <select
              value={experienceFilter || ""}
              onChange={(e) => setExperienceFilter(e.target.value || null)}
              className="rounded-md h-7"
            >
              <option value="">Experience Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <span className="text-white">Hours:</span>
            <div>
              <input
                type="number"
                min="0"
                max="500"
                step="10"
                value={hoursFromFilter === null ? "" : hoursFromFilter}
                onChange={(e) => {
                  const newValue = e.target.value === "" ? null : parseInt(e.target.value);
                  validateHours(newValue, hoursToFilter) &&
                    setHoursFromFilter(newValue)
                }}
                placeholder="From"
                className={styles['hour-input-mobile']}
              />
              <input
                type="number"
                min="0"
                max="500"
                step="10"
                value={hoursToFilter === null ? "" : hoursToFilter}
                onChange={(e) => {
                  const newValue = e.target.value === "" ? null : parseInt(e.target.value);
                  validateHours(hoursFromFilter, newValue) &&
                    setHoursToFilter(newValue)
                }}
                placeholder="To"
                className={styles['hour-input-mobile']}
              />
            </div>
            <span className={styles['hour-validation']}>{hourValidationMessage}</span>
          </div>
        )}

        <ul className="flex flex-col justify-center mt-2 gap-3">
          {filteredRoadmaps.map((roadmap: RoadmapMeta) => (
            <li
              key={roadmap.id}
              className=" rounded-lg shadow-md text-white"
              style={{ backgroundColor: "#141832" }}
            >
              <div className="flex items-center">
                <Link
                  className="text-left overflow-hidden flex justify-between flex-1"
                  href={`/explore/${roadmap.id}`}
                >
                  <div className="flex items-center px-2 py-1">
                    <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {roadmap.name}
                    </p>
                  </div>
                  <div className="flex items-center flex-col px-2 py-1">
                    <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      <Tooltip title={roadmap.experienceLevel} arrow>
                        <span>
                          {generateStarsforExperienceLevel(
                            roadmap.experienceLevel
                          )}
                        </span>
                      </Tooltip>
                    </p>
                    <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {roadmap.hours} hours
                    </p>
                  </div>
                </Link>
                {currentUser && favorites ? (
                  <span
                    className="mx-2"
                    onClick={() =>
                      favorites.some((favorite: any) => favorite.id === roadmap.id)
                        ? handleRemoveFromFavorites(roadmap)
                        : handleAddToFavorites(roadmap)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {favorites.some((favorite: any) => favorite.id === roadmap.id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

    </main>
  );
}

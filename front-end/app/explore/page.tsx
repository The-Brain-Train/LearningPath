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
import { RoadmapMeta, RoadmapMetaList } from "../types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import TuneIcon from "@mui/icons-material/Tune";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSession } from "next-auth/react";

export default function Explore() {
  const [roadmaps, setRoadmaps] = useState<RoadmapMeta[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapMeta[]>([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
  const [hoursFilter, setHoursFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<RoadmapMeta[]>([]);

  const { data: session, status } = useSession();

  const fetchRoadmaps = async () => {
    const roadmaps = await getRoadmaps();
    setRoadmaps(roadmaps.roadmapMetaList);
  };

  const fetchUserFavorites = async () => {
    if (status === "authenticated") {
      try {
        const userEmail = session?.user?.email;
        const favoriteRoadmaps = await getUserFavorites(userEmail);
        setFavorites(favoriteRoadmaps);
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    }
  };

  const handleRemoveFromFavorites = async (roadmapMeta: RoadmapMeta) => {
    try {
      await removeRoadmapMetaFromUserFavorites(
        session?.user?.email,
        roadmapMeta
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== roadmapMeta.id)
      );
    } catch (error) {
      console.error("Error removing roadmap from favorites:", error);
    }
  };

  const handleAddToFavorites = async (roadmapMeta: RoadmapMeta) => {
    try {
      await addRoadmapMetaToUserFavorites(session?.user?.email, roadmapMeta);
      setFavorites((prevFavorites) => [...prevFavorites, roadmapMeta]);
    } catch (error) {
      console.error("Error adding roadmap to favorites:", error);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    fetchUserFavorites();
  }, [session, status]);

  const filterRoadmaps = (roadmap: RoadmapMeta) => {
    if (experienceFilter && roadmap.experienceLevel !== experienceFilter) {
      return false;
    }
    if (hoursFilter !== null && roadmap.hours !== hoursFilter) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const filtered = roadmaps.filter(
      (roadmap) =>
        roadmap.name.toLowerCase().includes(search.toLowerCase()) &&
        filterRoadmaps(roadmap)
    );
    setFilteredRoadmaps(filtered);
  }, [search, roadmaps, experienceFilter, hoursFilter]);

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchText = event.currentTarget.value;
    setSearch(searchText);
  };

  return (
    <main className="main-background min-h-max flex items-center flex-col">
      <div className="flex flex-row my-5" style={{ maxWidth: "300px" }}>
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
      <div style={{ maxWidth: "300px", width: "80%" }}>
        {showFilters && (
          <div
            className="flex flex-col gap-1 border-2 p-2 rounded-sm"
            style={{ maxWidth: "200px", margin: "0 auto" }}
          >
            <span className="text-white">Filter:</span>
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
            <input
              type="number"
              min="0"
              step="10"
              value={hoursFilter === null ? "" : hoursFilter}
              onChange={(e) =>
                setHoursFilter(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              placeholder="Hours"
              className="rounded-md h-7"
            />
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
                <span
                className="mx-2"
                  onClick={() =>
                    favorites.some((favorite) => favorite.id === roadmap.id)
                      ? handleRemoveFromFavorites(roadmap)
                      : handleAddToFavorites(roadmap)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {favorites.some((favorite) => favorite.id === roadmap.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

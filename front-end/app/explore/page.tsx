"use client";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { getRoadmaps } from "../functions/httpRequests";
import { RoadmapMeta } from "../types";
import { generateStarsforExperienceLevel } from "../functions/generateStarsForExperience";
import TuneIcon from "@mui/icons-material/Tune";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";


export default function Explore() {
  const [roadmaps, setRoadmaps] = useState<RoadmapMeta[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapMeta[]>([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
  const [hoursFilter, setHoursFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchRoadmaps = async () => {
    const roadmaps = await getRoadmaps();
    setRoadmaps(roadmaps.roadMapMetaList);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

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
            className="flex flex-col gap-1 border-2 p-2"
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
          {filteredRoadmaps.map((roadMap: RoadmapMeta) => (
            <li key={roadMap.id} className="bg-slate-300 rounded-lg shadow-md">
              <Link
                className="text-left overflow-hidden flex justify-between"
                href={`/explore/${roadMap.id}`}
              >
                <div className="flex items-center px-2 py-1">
                  <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {roadMap.name}
                  </p>
                </div>
                <div className="flex items-center flex-col px-2 py-1">
                  <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                  <Tooltip title={roadMap.experienceLevel} arrow>
                    <span>{generateStarsforExperienceLevel(roadMap.experienceLevel)}</span>
                  </Tooltip>
                  </p>
                  <p className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {roadMap.hours} hours
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

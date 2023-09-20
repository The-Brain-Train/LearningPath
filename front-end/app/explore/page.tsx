"use client";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { deleteRoadmap, getRoadmaps } from "../functions/httpRequests";
import { RoadmapMeta } from "../types";
import DeleteModal from "../components/DeleteModal";

export default function Explore() {
  const [roadmaps, setRoadmaps] = useState<RoadmapMeta[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapMeta[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getRoadmaps().then((data) => setRoadmaps(data));
  }, []);

  useEffect(() => {
    const filtered = roadmaps.filter((roadmap) =>
      roadmap.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRoadmaps(filtered);
  }, [search, roadmaps]);
  
  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchText = event.currentTarget.value;
    setSearch(searchText);
  };

  const handleDelete = async (id: string) => {
    await deleteRoadmap(id);
    setRoadmaps((prevRoadmaps) =>
      prevRoadmaps.filter((roadmap) => roadmap.id !== id)
    );
  };

  return (
    <main className=" main-background min-h-max flex items-center  flex-col">
      <Paper
        component="form"
        sx={{
          m: "20px",
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
      <div className="roadMaps-list"
      style={{ maxWidth: '300px', width: '80%' }}>
        <ul className="flex flex-col justify-center ">
          {filteredRoadmaps.map((roadMap: RoadmapMeta) => (
            <li
              key={roadMap.id}
              className="bg-slate-300 mb-5 rounded-lg shadow-md "
            >
              <div className="roadmap-list-card flex justify-between items-center p-3">
                <Link
                  className="card-list-text card-body text-left overflow-hidden"
                  href={`/explore/${roadMap.id}`}
                >
                  <p className="lyric-card-name overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {roadMap.name}
                  </p>
                </Link>

                <div className="flex-shrink-0 min-w-max">
                  <DeleteModal id={roadMap.id} onDelete={(id) => handleDelete(id)}/>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

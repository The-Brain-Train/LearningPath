"use client"

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteRoadmap, getRoadmaps } from "../httpRequests";
import { RoadmapMeta } from "../types";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Explore() {

  const [roadmaps, setRoadmaps] = useState<RoadmapMeta[]>([]);

  useEffect(()=> {
    getRoadmaps().then(data => setRoadmaps(data));
  }, [])

  const handleDelete = async (id:string) => {
    await deleteRoadmap(id);
    setRoadmaps((prevRoadMaps) => prevRoadMaps.filter((roadmap) => roadmap.id !== id));
  };

  return (
    <main className="flex items-center justify-center flex-col">
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
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <div className="roadMaps-list">
          <ul className="flex flex-col justify-center ">
            {[...roadmaps].reverse().map((roadMap: RoadmapMeta) => (
              <li key={roadMap.id} className="bg-neutral mb-5 rounded-lg">
                <div className="roadmap-list-card flex justify-between items-center">
                  <Link
                    className="card-list-text card-body text-left overflow-hidden"
                    href={`/explore/${roadMap.roadMapReferenceId}`}
                  >
                    <p className="lyric-card-name overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {roadMap.name}
                    </p>
                  </Link>

                  <div className="flex-shrink-0 min-w-max">
                    <DeleteIcon onClick={() => handleDelete(roadMap.id)}/>
                  </div>
                </div>
              </li>
            ))}
          </ul>
      </div>


      {/* <div className="text-center">
        <ul>
          {roadmaps.map((roadMap, index) => (
            <li className="border-2 rounded m-4 p-2" key={index}>
              <Link key={roadMap.id} href={`/explore/${roadMap.roadMapReferenceId}`}>{roadMap.name}</Link>
            </li>
          ))}
        </ul>
      </div> */}
    </main>
  );
}

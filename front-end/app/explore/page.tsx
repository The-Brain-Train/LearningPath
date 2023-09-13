"use client"

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteRoadmap, getRoadmaps } from "../httpRequests";
import { RoadmapMeta } from "../types";
import DeleteButton from "../components/DeleteButton";

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
                    {/* <Link href={`/explore/${roadMap.roadMapReferenceId}`}>
                      <button className="edit-list edit-btn-list btn-sm mr-5">
                        <svg
                          xmlns="https://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                        >
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                        </svg>
                      </button>
                    </Link> */}

                    <button
                      className="delete-list delete-btn-list btn-sm"
                      onClick={() => handleDelete(roadMap.id)}
                    >
                      <svg
                        xmlns="https://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 448 512"
                      >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </button>
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

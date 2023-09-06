import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { enhancedDummyDataTwo } from "../dummyData";
import { Key, ReactElement, JSXElementConstructor, ReactNode, PromiseLikeOfReactNode, ReactPortal } from "react";

export default function Explore() {
  return (
    <main className="flex items-center justify-center flex-col">
      <Paper
        component="form"
        sx={{ m: "20px", p: "2px 4px", display: "flex", alignItems: "center", width: 250 }}
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
      <div className="text-center">
        <ul>
          {enhancedDummyDataTwo.map((specialty) => (
            <li key={specialty.id}>
              <h2>{specialty.name}</h2>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

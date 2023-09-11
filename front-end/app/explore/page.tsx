import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { enhancedDummyDataTwo } from "../dummyData";
import Link from "next/link";

export default function Explore() {
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
      <div className="text-center">
        <ul>
          {enhancedDummyDataTwo.map((specialty) => (
            <li className="border-2 rounded m-4 p-2" key={specialty.id}>
              <Link href={`/explore/${specialty.id}`}>{specialty.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

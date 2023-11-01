import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center h-screen">
    <Box className="flex justify-center items-center flex-col" >
      <CircularProgress color="inherit" size={150} />
    </Box>
  </div>
  );
}
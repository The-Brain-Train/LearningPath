"use client";
import { Box, CircularProgress } from "@mui/material";
import ProfilePageUnauthUser from "./ProfilePageUnauthUser";
import useCurrentUserQuery from "../functions/useCurrentUserQuery";
import dynamic from "next/dynamic";


const Profile = () => {
  const DynamicProfilePageAuthUser = dynamic(() => import("./ProfilePageAuthUser"));

  const { currentUser, isLoading } = useCurrentUserQuery();

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
    <>
      {currentUser ? (
        <DynamicProfilePageAuthUser currentUser={currentUser} />
      ) : (
        <ProfilePageUnauthUser />
      )}
    </>
  );
};

export default Profile;

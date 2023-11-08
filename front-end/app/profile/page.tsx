"use client";
import { User } from "../util/types";
import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";
import { Box, CircularProgress } from "@mui/material";
import ProfilePageUnauthUser from "../components/ProfilePageUnauthUser";
import ProfilePageAuthUser from "../components/ProfilePageAuthUser";

const Profile = () => {
  const [cookies] = useCookies(["user"]);

  const { data: currentUser, isLoading } = useQuery<User | null>(
    ["currentUser"],
    async () => {
      if (cookies.user) {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      }
      return null;
    }
  );

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
        <ProfilePageAuthUser currentUser={currentUser} />
      ) : (
        <ProfilePageUnauthUser />
      )}
    </>
  );
};

export default Profile;

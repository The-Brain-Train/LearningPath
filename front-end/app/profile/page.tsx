"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { User } from "../types";

const Profile = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (cookies.user) {
      const decodedUser = jwtDecode(cookies.user) as User;
      setCurrentUser(decodedUser);
    }
  }, [cookies.user]);

  return (
    <div className="mt-20">
      <h1>My Page</h1>
      {currentUser ? (
        <>
          <p>{currentUser.name}</p>
          <p>{currentUser.email}</p>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default Profile;

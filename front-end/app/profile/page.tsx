"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { User } from "../types";

const Profile = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  var currentUser: User | null = null;

  if (cookies.user) {
    currentUser = jwtDecode(cookies.user);
  }

  useEffect(()=> {
    console.log(currentUser);
  }, [currentUser])

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

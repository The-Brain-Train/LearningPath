"use client";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";

const Profile = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  var user = jwtDecode(cookies.user);

  return (
    <>
      <h1>My Page</h1>;
    </>
  );
};

export default Profile;

"use client"
import { useState } from "react";
import IndentedTree from "../components/IndentedTree";
import InputForm from "../components/InputForm";
import { useCookies } from "react-cookie";
import { User } from "../types";
import jwtDecode from "jwt-decode";


export default function  Create() {
  const [hours, setHours] = useState<number | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string| null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["user"]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (cookies.user) {
    const decodedUser: User | null = jwtDecode(cookies.user);
    setCurrentUser(decodedUser);
  }

  const resetForm = () => {
    setHours(null);
    setExperienceLevel(null);
    setTopic(null);
  };

  return (
    <main className="main-background">
      <InputForm setTopic={setTopic} setHours={setHours} setExperienceLevel={setExperienceLevel} resetForm={resetForm}/>
      <IndentedTree topic={topic} experienceLevel={experienceLevel} hours={hours} userEmail={currentUser?.email} />
    </main>
  );
}

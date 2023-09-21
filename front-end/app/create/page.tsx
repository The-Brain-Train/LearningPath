"use client";
import { useState } from "react";
import IndentedTree from "../components/IndentedTree";
import SearchTopic from "../components/SearchTopic";
import InputForm from "../components/InputForm";


export default function Create() {
  const [showChat, setShowChat] = useState(true);
  const [hours, setHours] = useState<number | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string| null>(null);
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <main className="main-background">
      {/* <SearchTopic
      toggleChat={toggleChat}
      setTopic={setTopic}
      /> */}
      <InputForm setTopic={setTopic} setHours={setHours} setExperienceLevel={setExperienceLevel}/>
      <IndentedTree topic={topic} experienceLevel={experienceLevel} hours={hours} />
    </main>
  );
}

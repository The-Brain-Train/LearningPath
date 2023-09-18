"use client";
import { useState } from "react";
import IndentedTree from "../components/IndentedTree";
import SearchTopic from "../components/SearchTopic";


export default function Create() {
  const [showChat, setShowChat] = useState(true);
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <main className="main-background">
      <SearchTopic
      toggleChat={toggleChat}
      setTopic={setTopic}
      />
      <IndentedTree topic={topic}/>
    </main>
  );
}

"use client";
import { useState } from "react";
import IndentedTree from "../components/IndentedTree";
import RoadMapChat from "../components/RoadMapChat";
import ChatButton from "../components/ChatButton";


export default function Create() {
  const [showChat, setShowChat] = useState(true);
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  const [topic, setTopic] = useState<string | null>(null);

  return (
    <main className="mt-7 mb-28">
      <RoadMapChat
        showChat={showChat}
        toggleChat={toggleChat}
        setTopic={setTopic}
      />
      <IndentedTree topic={topic}/>
      <ChatButton showChat={showChat} setShowChat={setShowChat} /> 
    </main>
  );
}

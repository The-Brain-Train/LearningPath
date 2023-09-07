
'use client'
import { useState } from "react";
import { enhancedDummyData } from "../dummyData"
import IndentedTree from "../components/IndentedTree";
import RoadMapChat from "../components/RoadMapChat";
import ChatButton from "../components/ChatButton";

export default function Create() {

  const [showChat, setShowChat] = useState(false);
  const toggleChat = () => {setShowChat(!showChat)}
  

    return (
      <main>
        <RoadMapChat showChat={showChat} toggleChat={toggleChat}/>
        <IndentedTree data={enhancedDummyData} />
        <ChatButton showChat = {showChat} setShowChat={setShowChat}/>
      </main>
    );
}
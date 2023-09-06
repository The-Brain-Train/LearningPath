
'use client'
import { useState } from "react";
import { enhancedDummyData } from "../dummyData"
import IndentedTree from "../components/IndentedTree";
import RoadMapChat from "../components/RoadMapChat";
import ChatButton from "../components/ChatButton";

export default function Create() {

  const [showChat, setShowChat] = useState(false);

  

    return (
      <main>

        
        {showChat && <RoadMapChat showChat={showChat}/>}
        <IndentedTree data={enhancedDummyData} />
        <ChatButton showChat = {showChat} setShowChat={setShowChat}/>
      </main>
    );
}
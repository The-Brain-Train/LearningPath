
import { useState } from "react";
import { enhancedDummyData } from "../dummyData"
import IndentedTree from "../components/IndentedTree";
import RoadMapChat from "../components/RoadMapChat";
import ChatButton from "../components/ChatButton";

export default function Create() {
  
    return (
      <main>
        <IndentedTree data={enhancedDummyData} />
        <ChatButton />
      </main>
    );
}

import { useState } from "react";
import { enhancedDummyData } from "../dummyData"
import IndentedTree from "../components/IndentedTree";

export default function Create() {
  
    return (
      <main>
        <IndentedTree data={enhancedDummyData} />
      </main>
    );
}
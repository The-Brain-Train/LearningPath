
import { useState } from "react";
import { enhancedDummyData } from "../dummyData"
import IndentedTree from "../components/IndentedTree";

export default function Create() {
  
    return (
      <>
        <IndentedTree data={enhancedDummyData} />
      </>
    );
}
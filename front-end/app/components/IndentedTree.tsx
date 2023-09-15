"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getResponseFromOpenAI } from "../openAIChat";
import SaveButton from "./SaveButton";
import { postRoadmap } from "../httpRequests";
import { RoadmapDTO } from "../types";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { chatHistory } from "../chatPreHistory";
import { enhancedDummyData } from "../dummyData";

type IndentedTreeProps = {
  topic: string | null;
};

const IndentedTree = ({ topic }: IndentedTreeProps) => {
  const [data, setData] = useState(null);
  const svgRef = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const saveRoadMap = () => {
    if(topic == null) return
    const requestData: RoadmapDTO = {
      name: topic,
      roadMap: JSON.stringify(data),
    };
    postRoadmap(requestData);
  }

  // const handleSendMessage = async () => {
  //   setLoading(true);
  //   console.log("Fetching data");
  //   try {
  //     const response = await getResponseFromOpenAI(chatHistory(topic));
  //     console.log(response);
  //     const jsonData = await JSON.parse(response.choices[0].message.content);
  //     setData(jsonData);
  //     console.log(jsonData);
  //   } catch (error) {
  //     console.error("Error parsing JSON:", error);
  //   }finally {
  //     setLoading(false); // Set loading to false when data is received
  //   }
  // };
  // useEffect(() => {
  //   if (topic != null) {
  //     handleSendMessage();
  //   }
  // }, [topic]);

  useEffect(() => {
    // if (data == null) return;
    const format = d3.format(",");
    const nodeSize = 21;
    const root = d3.hierarchy(enhancedDummyData).eachBefore(
      (
        (i) => (d) =>
          (d.index = i++)
      )(0)
    );
    const nodes = root.descendants();

    // Dynamically calculate width and height based on screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const width = screenWidth;
    const height = (nodes.length + 1) * nodeSize;

    const columns = [
      {
        value: (d) => d.value,
        format,
        x: screenWidth - 25,
      },
    ];

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-nodeSize / 2, (-nodeSize * 3) / 2, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; font: 14px sans-serif; overflow: visible;"
      );

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .selectAll()
      .data(root.links())
      .join("path")
      .attr(
        "d",
        (d) => `
        M${d.source.depth * nodeSize},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        h${nodeSize}
      `
      );

    const node = svg
      .append("g")
      .selectAll()
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(0,${d.index * nodeSize})`);

    node
      .append("circle")
      .attr("cx", (d) => d.depth * nodeSize)
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? null : "#999"));

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + 6)
      .text((d) => d.data.name);

    node.append("title").text((d) =>
      d
        .ancestors()
        .reverse()
        .map((d) => d.data.name)
        .join("/")
    );

    for (const { label, value, format, x } of columns) {
      svg
        .append("text")
        .attr("dy", "0.32em")
        .attr("y", -nodeSize)
        .attr("x", x)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(label);

      node
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", x)
        .attr("text-anchor", "end")
        .attr("fill", (d) => (d.children ? null : "#555"))
        .data(root.copy().sum(value).descendants())
        .text((d) => format(d.value, d));
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center">
    {isLoading ? ( 
      <div className="text-center font-bold text-xl">
        Creating Roadmap...loading<RestartAltIcon/></div>
    ) : (
      <>
        <svg className="overflow-hidden" ref={svgRef}></svg>
        {data !== null && <SaveButton saveClick={saveRoadMap} />}
      </>
    )}
  </div>
  );
};

export default IndentedTree;

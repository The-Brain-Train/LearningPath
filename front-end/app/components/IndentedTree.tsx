"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getResponseFromOpenAI } from "../functions/openAIChat";
import SaveButton from "./SaveButton";
import { postRoadmap } from "../functions/httpRequests";
import { RoadmapDTO, User } from "../types";
import { chatHistory } from "../functions/chatPreHistory";
import { Button, CircularProgress } from "@mui/material";

type IndentedTreeProps = {
  topic: string | null;
  experienceLevel: string | null;
  hours: number;
  userEmail: string | null | undefined;
};

const IndentedTree = ({
  topic,
  experienceLevel,
  hours,
  userEmail,
}: IndentedTreeProps) => {
  const [data, setData] = useState(null);
  const svgRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState(0);

  const saveRoadMap = async () => {
    if (topic == null || userEmail == null) return;
    const requestData: RoadmapDTO = {
      name: topic,
      roadmap: JSON.stringify(data),
      userEmail: userEmail,
      experienceLevel: experienceLevel,
      hours: totalHours
    };
    postRoadmap(requestData);
  };

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      console.log(hours, experienceLevel, topic);
      const response = await getResponseFromOpenAI(
        chatHistory(topic, experienceLevel, hours)
      );
      console.log(JSON.stringify(response));
      const jsonData = await JSON.parse(response.choices[0].message.content);
      console.log("original json respose: " + JSON.stringify(jsonData));
      const updatedJsonData = calculateTotalAndSubTotalValues(jsonData);
      const scaledJsonData = scaleValues(hours, updatedJsonData);
      const correctJsonData = calculateTotalAndSubTotalValues(scaledJsonData);
      console.log("corrected json respose: " + JSON.stringify(correctJsonData));
      setData(correctJsonData);
    } catch (error) {
      setCreateError(
        `Unable to generate roadmap. Please try again. Error: ${error}`
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAndSubTotalValues = (jsonData: any) => {
    let grandTotal = 0;
    console.log("jsonData.children: " + jsonData.children);
    for (let i = 0; i < jsonData.children.length; i++) {
      let chapter = jsonData.children[i];
      let total = 0;
      console.log("chapter.children : " + chapter.children)
      if(!chapter.children) {
        total = chapter.value;
        continue;
      }
      for (let j = 0; j < chapter.children.length; j++) {
        total = total + chapter.children[j].value;
      }
      grandTotal = grandTotal + total;
      chapter.value = total;
    }
    jsonData.value = grandTotal;
    setTotalHours(grandTotal);
    return jsonData;
  }

  const scaleValues = (userInputHours: number, jsonData: any) => {
      console.log("ratio generatedTotal:userInput = " + jsonData.value + " : " + userInputHours);
      const scalingFactor = userInputHours/ jsonData.value ;
      for (let i = 0; i < jsonData.children.length; i++) {
        let chapter = jsonData.children[i];
        for (let j = 0; j < chapter.children.length; j++) {
           chapter.children[j].value = Math.round(chapter.children[j].value * scalingFactor);
        }
      }
      return jsonData;
  }

  const graph = () => {
    d3.select(svgRef.current).selectAll("*").remove();
    const format = d3.format(",");
    const nodeSize = 21;
    const root = d3.hierarchy(data).eachBefore(
      (
        (i) => (d) =>
          (d.index = i++)
      )(0)
    );
    const nodes = root.descendants();

    const screenWidth = window.innerWidth;
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
      .attr("stroke", "#cbd5e1")
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
      .attr("transform", (d) => `translate(0,${d.index * nodeSize})`)
      .attr("fill", "#cbd5e1");

    node
      .append("circle")
      .attr("cx", (d) => d.depth * nodeSize)
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? null : "#cbd5e1"));

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + 6)
      .text((d) => d.data.name)
      .attr("fill", "#cbd5e1");

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
        .attr("fill", (d) => (d.children ? null : "#cbd5e1"))
        .attr("font-weight", (d) => (d.height == 0 ? 100: 900))
        .data(root.copy().descendants())
        .text((d) => format(d.data.value, d));
    }
  };

  useEffect(() => {
    if (topic != null) {
      handleSendMessage();
    }
  }, [topic]);

  useEffect(() => {
    if (data == null) return;
    graph();
    const createGraph = () => {
      window.addEventListener("resize", graph);
    };
    createGraph();
    return () => {
      window.removeEventListener("resize", graph);
    };
  }, [data]);

  return (
    <div className="flex flex-col px-3">
      {isLoading ? (
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
        >
          <div className="text-center font-bold text-xl text-slate-300">
            Creating Roadmap
          </div>
          <div>
            <CircularProgress />
          </div>
        </div>
      ) : (
        <>
          {createError ? (
            <p className="text-red-500 font-bold">{createError}</p>
          ) : (
            <>
              {data !== null ? (
                <div className="flex content-between justify-between flex-nowrap">
                  <p className="text-slate-300 pt-4 pl-2 font-bold">
                    Learning Path
                  </p>
                  <p className="text-slate-300 pt-4 pr-2 font-bold">Hours</p>
                </div>
              ) : (
                <p
                  className="text-slate-300 font-bold flex flex-col justify-center items-center h-screen  "
                  style={{ maxHeight: "90vw" }}
                >
                  Your RoadMap will be displayed Here!
                </p>
              )}
              <svg className="overflow-hidden pb-10" ref={svgRef}></svg>
              {data !== null && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-center gap-3">
                  <SaveButton saveClick={saveRoadMap} />
                  <Button
                    onClick={() => {
                      setData(null);
                      d3.select(svgRef.current).selectAll("*").remove();
                    }}
                    className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IndentedTree;

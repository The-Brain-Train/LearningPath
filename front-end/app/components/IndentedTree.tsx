"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import SaveButton from "./SaveButton";
import { Button, CircularProgress } from "@mui/material";
import { CustomNode, CreateIndentedTreeProps } from "../util/types";
import Link from "next/link";
import styles from '../create/create.module.css'
import { getHoursFontSize, getLabelFontSize, getLinkLength, getTextXOffset } from "../util/IndentedTreeUtil";

const IndentedTree = ({
  data,
  isLoading,
  createError,
  saveRoadmap,
  setData,
  currentUser,
}: CreateIndentedTreeProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const graph = () => {
    if (data == null) return;
    d3.select(svgRef.current).selectAll("*").remove();
    const format = d3.format(",");
    const nodeSize = 21;
    const root = d3.hierarchy(data).eachBefore(
      ((i) => (d) => {
        (d as CustomNode).index = i++;
      })(0)
    );
    const nodes = root.descendants();

    const screenWidth = window.innerWidth;
    const width = screenWidth;
    const height = (nodes.length + 1) * nodeSize;

    const columns = [
      {
        value: (d: any) => d.value,
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
        M${(d).source.depth * nodeSize},${(d as any).source.index * nodeSize}
        V${(d as any).target.index * nodeSize}
        h${nodeSize + getLinkLength()}
      `
      );

    const node = svg
      .append("g")
      .selectAll()
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(0,${(d as CustomNode).index * nodeSize})`)
      .attr("fill", "#cbd5e1");

    node
      .append("text")
      .attr("x", (d) => (d.depth * nodeSize) + getTextXOffset(d, -10, 40))
      .attr("y", 5)
      .style("font-size", "16px")
      .style("fill", (d) => (d.children ? "black" : "#cbd5e1"))
      .text((d) => {
        if (d.depth === 0) {
          return "📚";
        } else if (d.height === 0) {
          return "📖";
        } else {
          return "📕";
        }
      })

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 60))
      .attr("y", 0)
      .attr("font-weight", (d) => (d.depth === 0 ? 900 : 100))
      .style("font-size", (d) => getLabelFontSize(d))
      .text((d) => d.data.name)
      .attr("fill", "#cbd5e1");

    node.append("title").text((d) =>
      d
        .ancestors()
        .reverse()
        .map((d) => d.data.name)
        .join("/")
    );

    for (const { value, format, x } of columns) {
      svg
        .append("text")
        .attr("dy", "0.32em")
        .attr("y", -nodeSize)
        .attr("x", x)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")


      node
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", x)
        .attr("text-anchor", "end")
        .attr("fill", (d) => (d.children ? null : "#cbd5e1"))
        .attr("font-weight", (d) => (d.height == 0 ? 100 : 900))
        .style("font-size", d => getHoursFontSize(d))
        .data(root.copy().descendants())
        .text((d) => format(d.data.value));
    }
  };

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
                <>
                  <div className={styles['roadmap-tree-title']}>
                    <p className="text-slate-300 pt-4 pl-2 font-bold">
                      Learning Path
                    </p>
                    <p className="text-slate-300 pt-4 pr-2 font-bold">Hours</p>
                  </div>
                  <svg className={styles['roadmap-tree-structure']} ref={svgRef}></svg>
                  {currentUser ? (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-center gap-3">
                      <SaveButton saveClick={saveRoadmap} />
                      <Button
                        onClick={() => {
                          setData(null);
                          d3.select(svgRef.current).selectAll("*").remove();
                        }}
                        className="bg-red-500 hover-bg-red-600 py-2 px-4 rounded text-white"
                        style={{ marginTop: '10px', marginBottom: '10px' }}
                      >
                        Reset
                      </Button>
                    </div>
                  ) : (
                    <div className="text-white font-bold text-center mb-2">
                      <p>
                        You must{" "}
                        <Link
                          href="/signin"
                          className="underline cursor-pointer"
                        >
                          sign in
                        </Link>{" "}
                        to save roadmaps
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p
                  className="text-slate-300 font-bold flex flex-col justify-center items-center h-screen"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                  }}
                >
                  Your Roadmap will be displayed Here!
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IndentedTree;

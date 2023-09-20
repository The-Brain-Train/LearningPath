"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import { deleteRoadmap } from "../functions/httpRequests";
import DeleteModal from "./DeleteModal";

type IndentedTreeProps = {
  data: JSON | null;
  roadMapRefId: string;
};

const IndentedTreeWithData = ({ data, roadMapRefId }: IndentedTreeProps) => {
  const svgRef = useRef(null);
  const router = useRouter();

  const graph = () => {
    if (data == null) return;

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
        .data(root.copy().sum(value).descendants())
        .text((d) => format(d.value, d));
    }
  };

  useEffect(() => {
    graph();
    const createGraph = () => {
      window.addEventListener("resize", graph);
    };
    createGraph();
    return () => {
      window.removeEventListener("resize", graph);
    };
  }, [data]);

  const handleDelete = async (id: string) => {
    await deleteRoadmap(id);
    router.back();
  };

  return (
    <div className="flex flex-col px-3">
      <div>
        <div className="flex content-between justify-between flex-nowrap">
          <p className="text-slate-300 pl-2 font-bold">Learning Path</p>
          <p className="text-slate-300 pr-2 font-bold">Hours</p>
        </div>
        <svg className="overflow-hidden" ref={svgRef}></svg>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-2 flex justify-center">
        <DeleteModal
          id={roadMapRefId}
          onDelete={() => handleDelete(roadMapRefId)}
        />
      </div>
    </div>
  );
};

export default IndentedTreeWithData;

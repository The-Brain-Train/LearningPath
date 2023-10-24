"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { CustomNode, ExploreIndentedTreeProps, TreeNode } from "../util/types";
import styles from '../explore/explore.module.css';
import { getHoursFontSize, getLabelFontSize, getLinkLength, getTextXOffset, getNodeSize, getIconFontSize, getScreenWidthAdjustValue } from "../util/IndentedTreeUtil";

const IndentedTreeWithData = ({ data }: ExploreIndentedTreeProps) => {
  const svgRef = useRef(null);

  const graph = () => {
    if (data == null) return;

    d3.select(svgRef.current).selectAll("*").remove();
    const format = d3.format(",");
    const nodeSize = getNodeSize();
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
        x: screenWidth - getScreenWidthAdjustValue(),
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
      .style("font-size", getIconFontSize())
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
      .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 80))
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
      <div>
        <div className={styles['roadmap-tree-title']}>
          <p className="text-slate-300 pl-2 font-bold">Learning Path</p>
          <p className="text-slate-300 pr-2 font-bold">Hours</p>
        </div>
        <svg className={styles['roadmap-tree-structure']} ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default IndentedTreeWithData;

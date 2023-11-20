"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  CustomNode,
  ExploreIndentedTreeProps,
  TreeNode,
} from "../../util/types";
import {
  getHoursFontSize,
  getLabelFontSize,
  getLinkLength,
  getTextXOffset,
  getLabelXOffset,
  getNodeSize,
  getIconFontSize,
  getScreenWidthAdjustValue,
} from "../../util/IndentedTreeUtil";
import addGoogleFont from "../../util/fontFamily";
import _ from "lodash";

const IndentedTreeWithData = ({
  data,
  updateCompletedTopic,
  isCreator
}: ExploreIndentedTreeProps) => {
  const svgRef = useRef(null);
  const debouncedGraph = useRef(_.debounce(() => graph(), 300));

  const handleTitleClick = (d: any) => {
    if (!d.children) {
      const clickedElementName = d.target.innerHTML;
      if (clickedElementName) {
        updateCompletedTopic(clickedElementName);
      } else {
        console.error("Name or identifier not found for the clicked element");
      }
    }
  };

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
        M${d.source.depth * nodeSize},${(d as any).source.index * nodeSize}
        V${(d as any).target.index * nodeSize}
        h${nodeSize + getLinkLength()} 
      `
      );

    const node = svg
      .append("g")
      .selectAll()
      .data(nodes)
      .join("g")
      .attr(
        "transform",
        (d) => `translate(0,${(d as CustomNode).index * nodeSize})`
      )
      .attr("fill", "#cbd5e1");

    node
      .append("text")
      .attr("x", (d) => d.depth * nodeSize + getLabelXOffset(d, -10, 40))
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
      });

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 80))
      .attr("y", 0)
      .attr("font-weight", (d) => (d.depth === 0 ? 900 : 100))
      .style("font-size", (d) => getLabelFontSize(d))
      .style("font-family", "'Poppins', sans-serif")
      .text((d) => d.data.name)
      .attr("fill", "#cbd5e1")
      .on("click", handleTitleClick);

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
        .attr("font-weight", "bold");
      node
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", x)
        .attr("text-anchor", "end")
        .attr("fill", (d) => (d.children ? null : "#cbd5e1"))
        .attr("font-weight", (d) => (d.height == 0 ? 100 : 900))
        .style("font-size", (d) => getHoursFontSize(d))
        .data(root.copy().descendants())
        .text((d) => format(d.data.value));
    }
    if (isCreator) {
      applyStrikethrough();
    }
  };

  useEffect(() => {
    addGoogleFont();
    graph();
    const createGraph = () => {
      window.addEventListener("resize", debouncedGraph.current);
    };
    createGraph();
    return () => {
      window.removeEventListener("resize", debouncedGraph.current);
    };
  }, [data]);

  const applyStrikethrough = () => {
    d3.select(svgRef.current)
      .selectAll("text")
      .each(function (d: any) {
        const datum = d?.data;
        if (datum && datum.completedTopic) {
          d3.select(this).style("text-decoration", "line-through");
        } else {
          d3.select(this).style("text-decoration", "none");
        }
      });
  };

  return (
    <div>
      <div className="flex justify-between px-4">
        <p className="text-xl text-center font-bold text-white md:text-2xl">
          Learning Path
        </p>
        <p className="text-xl text-center font-bold text-white md:text-2xl">
          Hours
        </p>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IndentedTreeWithData;

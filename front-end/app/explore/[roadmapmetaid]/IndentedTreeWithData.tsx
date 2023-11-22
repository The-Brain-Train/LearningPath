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
  isCreator,
}: ExploreIndentedTreeProps) => {
  const svgRef = useRef(null);
  const debouncedGraph = useRef(_.debounce(() => graph(), 100));

  const handleTitleClick = (d: any) => {
    if (!d.children) {
      const clickedElementName = d.data.name;
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
          return "";
        } else {
          return "📘";
        }
      });

    node
      .filter((d) => d.height !== 0)
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 15, 80))
      .attr("y", 0)
      .attr("width", 300)
      .attr("font-weight", (d) => (d.depth === 0 ? 900 : 100))
      .style("font-size", (d) => getLabelFontSize(d))
      .style("font-family", "'Poppins', sans-serif")
      .text((d) => {
        const nodeName = d.data.name;
        return nodeName;
      })
      .attr("fill", "#cbd5e1");

    if (isCreator) {
      node
        .filter((d) => d.height === 0)
        .append("foreignObject")
        .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 60))
        .attr("y", -10)
        .attr("width", 600)
        .attr("height", 50)
        .html(function (d) {
          const completedCheckbox = d.data.completedTopic ? "checked" : "";
          return `
      <div class="flex items-center">
        <input ${completedCheckbox} type="checkbox" value=${d.data.name} class="w-4 h-4">
        <label class="text-gray-300 text:xs md:text-lg ml-2">${d.data.name}</label>
      </div>
    `;
        })
        .each(function (d) {
          d3.select(this).style("font-family", "'Poppins', sans-serif");
        })
        .on("click", function (d) {
          const data = d.target.__data__;
          if (!d.children && data.height === 0 && isCreator) {
            handleTitleClick(data);
          }
        });
    }
    
    if (!isCreator) {
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
            return "📘";
          }
        });

      node
        .filter((d) => d.height === 0)
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 15, 80))
        .attr("y", 0)
        .attr("width", 300)
        .attr("font-weight", (d) => (d.depth === 0 ? 900 : 100))
        .style("font-size", (d) => getLabelFontSize(d))
        .style("font-family", "'Poppins', sans-serif")
        .text((d) => {
          const nodeName = d.data.name;
          return nodeName;
        })
        .attr("fill", "#cbd5e1");
    }

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
      toggleCheckBox();
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

  const toggleCheckBox = () => {
    d3.select(svgRef.current)
      .selectAll("foreignObject")
      .each(function (d: any) {
        const datum = d?.data;
        const checkbox = d3.select(this).select("input");
        if (datum && datum.completedTopic) {
          checkbox.property("checked", true);
        } else {
          checkbox.property("checked", false);
        }
      });
  };

  return (
    <div className="mb-10">
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

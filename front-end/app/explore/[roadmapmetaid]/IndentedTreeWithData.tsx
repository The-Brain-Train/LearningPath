"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  CustomNode,
  ExploreIndentedTreeProps,
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
  const [debouncedGraph, setDebouncedGraph] = useState<any>(null);

  const handleCheckBoxClick = (treeLabelName: string) => {
    console.log(treeLabelName);
    if (treeLabelName) {
      updateCompletedTopic(treeLabelName);
    } else {
      console.error("Name or identifier not found for the clicked element");
    }
  };

  const createGraph = useCallback(() => {
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
    let width: any = screenWidth;
    const height = (nodes.length + 1) * nodeSize;

    if (screenWidth >= 1280) {
      width = 1280;
    }

    const columns = [
      {
        value: (d: any) => d.value,
        format,
        x: width - getScreenWidthAdjustValue(),
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
      .attr("stroke", "#fff")
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
      .attr("fill", "#fff");

    node
      .append("text")
      .attr("x", (d) => d.depth * nodeSize + getLabelXOffset(d, -10, 40))
      .attr("y", 5)
      .style("font-size", getIconFontSize())
      .style("fill", (d) => (d.children ? "black" : "#fff"))
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
      .append("foreignObject")
      .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 60))
      .attr("y", -15)
      .attr("width", 550)
      .attr("height", 25)
      .html(function (d) {
        return `<p class="text-white text-lg md:text-xl ml-2 mt-1 md:mt-0 md:ml-4">${d.data.name}</p>`;
      })
      .each(function (d) {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 550) {
          d3.select(this)
            .select("p")
            .style("max-width", "300px")
            .style("max-height", "22px")
            .style("overflow-x", "auto")
            .style("white-space", "nowrap")
            .style("font-family", "'Poppins', sans-serif");
        }
        if (screenWidth <= 450) {
          d3.select(this).select("p").style("max-width", "250px");
        }
        if (screenWidth <= 350) {
          d3.select(this).select("label").style("max-width", "150px");
        }
      });
      
    if (isCreator) {
      node
        .filter((d) => d.height === 0)
        .append("foreignObject")
        .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 60))
        .attr("y", -10)
        .attr("width", 550) 
        .attr("height", 50)
        .html(function (d) {
          const completedCheckbox = d.data.completedTopic ? "checked" : "";
          return `
            <div class="flex items-center content-div">
              <input ${completedCheckbox} type="checkbox" value=${d.data.name} class="w-4 h-4 md:w-5 md:h-5">
              <label class="text-white text:xs md:text-lg ml-2">${d.data.name}</label>
            </div>
          `;
        })
        .each(function (d) {
          const screenWidth = window.innerWidth;
          if (screenWidth <= 550) {
            d3.select(this).style("font-family", "'Poppins', sans-serif");
            d3.select(this)
            .select("label")
            .style("max-width", "300px")
            .style("max-height", "22px")
            .style("overflow-x", "auto")
            .style("white-space", "nowrap");
          }
          if (screenWidth <= 450) {
            d3.select(this)
            .select("label")
            .style("max-width", "200px");
          }
          if (screenWidth <= 350) {
            d3.select(this)
            .select("label")
            .style("max-width", "150px");
          }
        })
        .on("click", function (d) {
          console.log(d);
          if (d.target.__data__ && isCreator) {
            const treeLabelObject = d.target.__data__;
            if (!d.children && treeLabelObject.height === 0) {
              const treeLabelName: string = treeLabelObject.data.name;
              handleCheckBoxClick(treeLabelName);
            }
          }
          if (d.target.innerText && isCreator) {
            const treeLabelName: string = d.target.innerText;
            handleCheckBoxClick(treeLabelName);
          }
        });
    }

    if (!isCreator) {
      node
        .append("text")
        .attr("x", (d) => d.depth * nodeSize + getLabelXOffset(d, -10, 40))
        .attr("y", 5)
        .style("font-size", getIconFontSize())
        .style("fill", (d) => (d.children ? "black" : "#fff"))
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
        .append("foreignObject")
        .attr("x", (d) => d.depth * nodeSize + getTextXOffset(d, 10, 60))
        .attr("y", -15)
        .attr("width", 550)
        .attr("height", 25)
        .html(function (d) {
          return `<p class="text-white text-sm md:text-lg ml-2 mt-1 md:mt-0 md:ml-4">${d.data.name}</p>`;
        })
        .each(function (d) {
          const screenWidth = window.innerWidth;
          if (screenWidth <= 550) {
            d3.select(this)
              .select("p")
              .style("max-width", "300px")
              .style("max-height", "22px")
              .style("overflow-x", "auto")
              .style("white-space", "nowrap")
              .style("font-family", "'Poppins', sans-serif");
          }
          if (screenWidth <= 450) {
            d3.select(this).select("p").style("max-width", "200px");
          }
          if (screenWidth <= 350) {
            d3.select(this).select("label").style("max-width", "150px");
          }
        });
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
        .attr("fill", (d) => (d.children ? null : "#fff"))
        .attr("font-weight", (d) => (d.height == 0 ? 100 : 900))
        .style("font-size", (d) => getHoursFontSize(d))
        .data(root.copy().descendants())
        .text((d) => format(d.data.value));
    }
    if (isCreator) {
      toggleCheckBox();
    }
  }, [data, isCreator]);

  useEffect(() => {
    addGoogleFont();
    createGraph();

    const handleResizeDebounced = _.debounce(() => {
      createGraph();
    }, 100);

    setDebouncedGraph(() => handleResizeDebounced);

    window.addEventListener("resize", handleResizeDebounced);

    return () => {
      window.removeEventListener("resize", handleResizeDebounced);
      handleResizeDebounced.cancel();
    };
  }, [createGraph]);

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

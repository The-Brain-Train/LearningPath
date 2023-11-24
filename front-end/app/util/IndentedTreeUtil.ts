import d3 from "d3";
import { TreeNode } from "./types";

export const isMobileView = () => {
  return window.innerWidth < 768;
};

export const getIconFontSize = () => {
  if (isMobileView()) {
    return "16px";
  } else {
    return "22px";
  }
};

export const getLabelFontSize = (d: d3.HierarchyNode<TreeNode>) => {
  if (isMobileView()) {
    if (d.depth === 0) {
      return "18px";
    } else if (d.depth === 1) {
      return "16px";
    } else {
      return "14px";
    }
  } else {
    return "22px";
  }
};

export const getHoursFontSize = (d: d3.HierarchyNode<TreeNode>) => {
  if (isMobileView()) {
    if (d.depth === 0) {
      return "18px";
    } else if (d.depth === 1) {
      return "16px";
    } else {
      return "14px";
    }
  } else {
    return "22px";
  }
};

export const getLabelWidth = (d: d3.HierarchyNode<TreeNode>) => {
  if (window.innerWidth < 550) {
    return 300;
  } else {
    return 600;
  }
};

export const getTextXOffset = (
  d: d3.HierarchyNode<TreeNode>,
  mobile: number,
  desktop: number
) => {
  if (isMobileView()) {
    return mobile;
  } else {
    return d.depth === 0 ? mobile + 20 : desktop;
  }
};

export const getLabelXOffset = (
  d: d3.HierarchyNode<TreeNode>,
  mobile: number,
  desktop: number
) => {
  if (isMobileView()) {
    return mobile;
  } else {
    return d.depth === 0 ? mobile : desktop;
  }
};

export const getLinkLength = () => {
  if (isMobileView()) {
    return 0;
  } else {
    return 50;
  }
};

export const getNodeSize = () => {
  if (isMobileView()) {
    return 30;
  } else {
    return 40;
  }
};

export const getScreenWidthAdjustValue = () => {
  if (isMobileView()) {
    return 25;
  } else {
    return 45;
  }
};

// export const foreignObjectStylingForSmallerScreens = (element: SVGForeignObjectElement) => {
//   const screenWidth = window.innerWidth;
//   if (screenWidth <= 550) {
//     d3.select(element).style("font-family", "'Poppins', sans-serif");
//     d3.select(element)
//       .select("label")
//       .style("max-width", "300px")
//       .style("max-height", "22px")
//       .style("overflow-x", "auto")
//       .style("white-space", "nowrap");
//   }
//   if (screenWidth <= 450) {
//     d3.select(element).select("label").style("max-width", "200px");
//   }
//   if (screenWidth <= 350) {
//     d3.select(element).select("label").style("max-width", "150px");
//   }
// };

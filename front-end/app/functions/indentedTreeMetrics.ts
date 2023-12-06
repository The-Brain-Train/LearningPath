import d3 from "d3";
import { TreeNode } from "../util/types";

export const isMobileView = () => {
  return window.innerWidth < 768;
};

export const getScreenWidthAdjustValue = () => {
  if (isMobileView()) {
    return 25;
  } else {
    return 45;
  }
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

export const getTextOffset = (
  mobile: number,
  desktop: number
) => {
  if (isMobileView()) {
    return mobile;
  } else {
    return desktop;
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


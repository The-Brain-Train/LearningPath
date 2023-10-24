import { TreeNode } from "./types";

export const isMobileView = () => {
    return window.innerWidth < 1000;
}

export const getLabelFontSize = (d: d3.HierarchyNode<TreeNode>) => {
    if (isMobileView()) {
        return "14px";
    } else {
        if (d.depth === 0) {
            return "20px";
        } else if (d.height === 0) {
            return "16px";
        } else {
            return "18px";
        }
    }
}

export const getHoursFontSize = (d: d3.HierarchyNode<TreeNode>) => {
    if (isMobileView()) {
        return "14px";
    } else {
        if (d.depth === 0) {
            return "20px";
        } else if (d.depth === 1) {
            return "18px";
        } else if (d.depth === 2) {
            return "16px";
        } else {
            return "14px";
        }
    }
}

export const getTextXOffset = (d: d3.HierarchyNode<TreeNode>, mobile: number, desktop: number) => {
    if (isMobileView()) {
        return mobile;
    } else {
        return d.depth === 0 ? mobile : desktop;
    }
}

export const getLinkLength = () => {
    if (isMobileView()) {
        return 0;
    } else {
        return 50;
    }
}
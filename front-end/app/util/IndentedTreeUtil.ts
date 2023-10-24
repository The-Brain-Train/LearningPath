import { TreeNode } from "./types";

export const isMobileView = () => {
    return window.innerWidth < 1000;
}

export const getIconFontSize = () => {
    if (isMobileView()) {
        return "16px";
    } else {
        return "24px"
    }
}

export const getLabelFontSize = (d: d3.HierarchyNode<TreeNode>) => {
    if (isMobileView()) {
        return "14px";
    } else {
        if (d.depth === 0) {
            return "30px";
        } else if (d.height === 0) {
            return "26px";
        } else {
            return "28px";
        }
    }
}

export const getHoursFontSize = (d: d3.HierarchyNode<TreeNode>) => {
    if (isMobileView()) {
        return "14px";
    } else {
        if (d.depth === 0) {
            return "30px";
        } else if (d.depth === 1) {
            return "28px";
        } else if (d.depth === 2) {
            return "26px";
        } else {
            return "24px";
        }
    }
}

export const getTextXOffset = (d: d3.HierarchyNode<TreeNode>, mobile: number, desktop: number) => {
    if (isMobileView()) {
        return mobile;
    } else {
        return d.depth === 0 ? mobile + 20 : desktop;
    }
}

export const getLabelXOffset = (d: d3.HierarchyNode<TreeNode>, mobile: number, desktop: number) => {
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

export const getNodeSize = () => {
    if (isMobileView()) {
        return 21;
    } else {
        return 55;
    }
}

export const getScreenWidthAdjustValue = () => {
    if (isMobileView()) {
        return 25;
    } else {
        return 45;
    }
}
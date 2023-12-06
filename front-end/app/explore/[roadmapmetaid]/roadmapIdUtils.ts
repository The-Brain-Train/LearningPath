import { Roadmap } from "@/app/util/types";

export const downloadRoadmapAsJson = (roadmap: Roadmap | undefined) => {
  const roadmapData = JSON.stringify(roadmap, null, 2);
  const blob = new Blob([roadmapData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "roadmap.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadRoadmapAsSvg = async () => {
  const roadmapSvgElement = document.getElementById("roadmap-svg");

  if (roadmapSvgElement instanceof SVGElement) {
    const clonedSvgElement = roadmapSvgElement.cloneNode(true) as SVGElement;

    const screenWidth = window.innerWidth;
    const desktopHeight = roadmapSvgElement.scrollHeight;
    const mobileHeight = roadmapSvgElement.scrollHeight * 1.1;

    clonedSvgElement.setAttribute("width", "100%");
    clonedSvgElement.setAttribute("height", "100%");
    if (screenWidth < 768) {
      clonedSvgElement.setAttribute(
        "viewBox",
        `-20 -30 ${screenWidth} ${mobileHeight}`
      );
    } else {
      clonedSvgElement.setAttribute(
        "viewBox",
        `-30 -30 ${screenWidth}  ${desktopHeight}`
      );
    }

    const textElements = clonedSvgElement.querySelectorAll("text");
    textElements.forEach((textElement) => {
      textElement.setAttribute("font-weight", "normal");
      textElement.style.fontWeight = "normal";
      textElement.setAttribute("font-size", "14");
      textElement.style.fontSize = "14px";
    });

    const svgData = new XMLSerializer().serializeToString(clonedSvgElement);
    const modifiedSvgData = svgData.replace(/fill="#fff"/g, 'fill="#000"');

    const blob = new Blob([modifiedSvgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export const shareRoadmap = async (roadmapName: string | undefined) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: `Check out this roadmap on LearningPath: ${roadmapName}`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    prompt("Copy the following URL:", window.location.href);
  }
}

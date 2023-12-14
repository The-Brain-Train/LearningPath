import { useFilterContext } from "./FilterProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function FilterShow() {
  const queryClient = useQueryClient();
  const filterContext = useFilterContext();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!filterContext) {
    return null;
  }

  const setOpenAttribute = () => {
    if (isLargeScreen) {
      return { open: true };
    }
    return {};
  };

  const {
    experienceFilter,
    setExperienceFilter,
    hoursFromFilter,
    setHoursFromFilter,
    hoursToFilter,
    setHoursToFilter,
    validateHours,
  } = filterContext;

  return (
    <div className="mb-5 md:mb-0">
      <details className="group" {...setOpenAttribute()}>
        <summary
          className={`text-white text-xs flex justify-between items-center font-medium cursor-pointer list-none border-b md:border-none ${
            !isLargeScreen ? "md:hidden" : ""
          }`}
        >
          <span className="md:hidden"> Filters </span>
          <span className="transition group-open:rotate-180 md:hidden">
            <svg
              fill="none"
              height="18"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </span>
        </summary>
        <div className={`${isLargeScreen ? "md:flex flex-col md:flex-row md:gap-3" : ""}`}>
          <div>
            <label
              id="listbox-label"
              className="block text-xs font-medium leading-6 text-white"
            >
              Experience level
            </label>
            <select
              value={experienceFilter || ""}
              onChange={(e) => {
                setExperienceFilter(e.target.value || null);
                queryClient.setQueryData(["experienceLevel"], e.target.value);
                queryClient.invalidateQueries(["roadmaps"]);
              }}
              id="experienceLevel_disabled"
              className="font-medium bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="" selected>
                All
              </option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label
              id="listbox-label"
              className="block text-xs font-medium leading-6 text-white mt-1 md:mt-0"
            >
              Hours
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                step="10"
                id="FilterHoursFrom"
                placeholder="From"
                className="p-2.5 w-32 rounded-md border-gray-200 shadow-sm sm:text-sm"
                value={hoursFromFilter === null ? "" : hoursFromFilter}
                onChange={(e) => {
                  const newValue =
                    e.target.value === "" ? null : parseInt(e.target.value);
                  validateHours(newValue, hoursToFilter) &&
                    setHoursFromFilter(newValue);
                  queryClient.setQueryData(["hoursFromFilter"], newValue);
                  queryClient.invalidateQueries(["roadmaps"]);
                }}
              />
              <span className="text-white mx-2"> - </span>
              <input
                type="number"
                step="10"
                min="0"
                id="FilterHoursTo"
                placeholder="To"
                className="w-32 p-2.5 rounded-md border-gray-200 shadow-sm sm:text-sm"
                value={hoursToFilter === null ? "" : hoursToFilter}
                onChange={(e) => {
                  const newValue =
                    e.target.value === "" ? null : parseInt(e.target.value);
                  validateHours(hoursFromFilter, newValue) &&
                    setHoursToFilter(newValue);
                  queryClient.setQueryData(["hoursToFilter"], newValue);
                  queryClient.invalidateQueries(["roadmaps"]);
                }}
              />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
